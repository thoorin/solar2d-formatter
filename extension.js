const vscode = require('vscode');

function getMissingSpacePositions(regEx, text) {
	let positions = [];
	let subString = text;

	while (subString.search(regEx) != -1) {
		const positionIncrement = positions.length == 0 ? 0 : positions[positions.length - 1];
		positions.push(subString.search(regEx) + 1 + positionIncrement);
		subString = text.substring(positions[positions.length - 1]);
	}

	return positions;
}

function findPairs(openingRegEx, text, operatorLength = 1, closingRegEx = openingRegEx) {
	let positions = [];
	let subString = text;

	let startingQuote = true;
	while (subString.search(openingRegEx) != -1 || subString.search(closingRegEx) != -1) {
		const positionIncrement = positions.length == 0 ? 0 : positions[positions.length - 1][positions[positions.length - 1].length - 1];

		if (startingQuote) {
			positions.push([subString.search(openingRegEx) + positionIncrement + operatorLength]);
			startingQuote = false;
		} else {
			positions[positions.length - 1].push(subString.search(closingRegEx) + positionIncrement + operatorLength);
			startingQuote = true;
		}

		const lastPair = positions[positions.length - 1];
		subString = text.substring(lastPair[lastPair.length - 1]);
	}

	return positions;
}

function checkLineFormat(text, previousLineNonClosedBrackets = false) {

	const missingSpaceExpressions = [
		// parentheses
		/(\([^ \t)])|([^ \t(]\))/,

		// curly brackets
		/(\{[^ \t}])|([^ \t{]\})/,

		// minus
		/([^ \t\(\{]-)|(-[^ \t])/,

		// plus
		/([^ \t]\+)|(\+[^ \t])/,

		// multiplication,
		/([^ \t]\*)|(\*[^ \t])/,

		// division
		/([^ \t]\/)|(\/[^ \t])/,

		// modulo
		/([^ \t]%)|(%[^ \t])/,

		// exponent
		/([^ \t]\^)|(\^[^ \t])/,

		// greaterThan
		/([^ \t]>)|(>[^ \=\t])/,

		// lessThan
		/([^ \t]<)|(<[^ \=\t])/,

		// comma
		/,[^ \t]/,

		// equals
		/([^ \=><~\t]=)|(=[^ \=\t])/,

		// unequal
		/[^ \t]~/,
	];

	const missingSpacePositions = missingSpaceExpressions.map(
		(regEx => getMissingSpacePositions(regEx, text)));


	// double square brackets positions
	const sqPositions = findPairs(/(--)*\[\[/, text, 2, /\]\](--)*/);
	const stringTagsPositions = sqPositions.
		concat(findPairs(/'/, text)).
		concat(findPairs(/"/, text));

	const sqBracketsClosingPosition = text.search(/\]\]/);
	const startsNonClosedBrackets = sqPositions.length != 0 && sqBracketsClosingPosition == -1



	/******************** BEGIN: filter functions ******************/

	function isCommented(pos) {

		const searchResult = text.search(/--/);

		const commentPosition = searchResult != -1
			? searchResult
			: Infinity;

		return pos >= commentPosition;
	}

	const isInNonClosedSqBrackets = (pos) =>
		previousLineNonClosedBrackets && pos <= sqBracketsClosingPosition;

	function isInInlineString(pos) {
		// pPositions = pair positions
		const predicate = (pPositions) => pos >= pPositions[0] && pos < pPositions[1];

		return stringTagsPositions.find(predicate) != null;
	}

	function isInStartedString(pos) {
		const lastSqPairPosition = sqPositions[sqPositions.length - 1];

		return startsNonClosedBrackets && pos >= lastSqPairPosition[0];
	}

	/******************** END: filter functions ******************/


	// ignore line if entire line is commented (or in string)
	const ignoreLine = (previousLineNonClosedBrackets && sqBracketsClosingPosition == -1);

	return {
		missingSpaces: missingSpacePositions.flat()
			.filter(pos =>
				!ignoreLine
				&& !isCommented(pos)
				&& !isInNonClosedSqBrackets(pos)
				&& !isInInlineString(pos)
				&& !isInStartedString(pos)
			)
			.sort(function (a, b) { return a - b }),
		nonClosedSqBracket: ignoreLine || startsNonClosedBrackets
	}
}

function checkAllLinesFormat(lineCount, getLine, documentUri) {
	const edits = [];

	// nonClosedSqBrackets is a flag that indicates whether the current line 
	// contains non-closed square double brackets (used for multi-line strings or comments)
	let nonClosedSqBrackets = false;

	for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
		const line = getLine(lineIndex);

		// lineFormat contains information about whether the line contains non-closed string
		// and positions of missing spaces
		const lineFormat = checkLineFormat(line.text, nonClosedSqBrackets);
		nonClosedSqBrackets = lineFormat.nonClosedSqBracket;

		for (let charPos = lineFormat.missingSpaces.length - 1; charPos >= 0; charPos--) {
			edits.push(vscode.TextEdit.insert(new vscode.Position(lineIndex, lineFormat.missingSpaces[charPos]), ' '));
		}
	}

	return edits;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const selectors = [
		{ language: 'lua', scheme: 'file' },
		{ language: 'lua', scheme: 'untitled' },
	];

	vscode.languages.registerDocumentFormattingEditProvider(
		selectors,
		{
			provideDocumentFormattingEdits: (document, options, token) => {
				return new Promise((resolve, reject) => {
					resolve(checkAllLinesFormat(document.lineCount, document.lineAt, document.uri));
				})
			}
		}
	);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
	checkLineFormat,
	checkAllLinesFormat
}