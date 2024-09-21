// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

// todo rename

// third parameter is weird
function parenthesesPositions(regEx, text, operatorLength = 1) {
	let positions = [];
	let subString = text;

	while (subString.search(regEx) != -1) {
		const positionIncrement = positions.length == 0 ? 0 : positions[positions.length - 1];
		positions.push(subString.search(regEx) + operatorLength + positionIncrement);
		subString = text.substring(positions[positions.length - 1]);
	}

	return positions;
}

function findPairs(regEx, text, operatorLength = 1, closingRegEx = regEx) {
	let positions = [];
	let subString = text;

	let startingQuote = true;
	while (subString.search(regEx) != -1 || subString.search(closingRegEx) != -1) {
		const positionIncrement = positions.length == 0 ? 0 : positions[positions.length - 1][positions[positions.length - 1].length - 1];

		if (startingQuote) {
			positions.push([subString.search(regEx) + positionIncrement + operatorLength]);
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

function checkLineFormat(text, previousLineNonClosedStrings = false) {

	const filters = [
		// parentheses
		/(\([^ )])|([^ (]\))/,

		// curly brackets
		/(\{[^ }])|([^ {]\})/,

		// minus
		/([^ ]-)|(-[^ ])/,

		// plus
		/([^ ]\+)|(\+[^ ])/,

		// multiplication,
		/([^ ]\*)|(\*[^ ])/,

		// division
		/([^ ]\/)|(\/[^ ])/,

		// modulo
		/([^ ]%)|(%[^ ])/,

		// exponent
		/([^ ]\^)|(\^[^ ])/,

		// greaterThan
		/([^ ]>)|(>[^ \=])/,

		// lessThan
		/([^ ]<)|(<[^ \=])/,

		// comma
		/,[^ ]/,

		// equals
		/([^ \=><~]=)|(=[^ \=])/,

		// unequal
		/[^ ]~/,
	];

	const edits = filters.map((filter => parenthesesPositions(filter, text)));



	// double square brackets positions
	const sqPositions = findPairs(/\[\[/, text, 2, /\]\]/);
	const stringTagsPositions = sqPositions.
		concat(findPairs(/'/, text)).
		concat(findPairs(/"/, text));

	const closingPosition = text.search(/]]/);
	const startsNonClosedString = sqPositions.length != 0 && closingPosition == -1



	/******************** BEGIN: filter functions ******************/

	function isCommented(edit) {

		const searchResult = text.search(/--/);
		const commentPosition = searchResult != -1
			? searchResult
			: Infinity;

		return edit >= commentPosition;
	}

	const isInNonClosedString = (edit) =>
		previousLineNonClosedStrings && edit <= closingPosition;

	function isInInlineString(edit) {
		const predicate = (pPosition) => edit >= pPosition[0] && edit < pPosition[1];

		return stringTagsPositions.find(predicate) != null;
	}

	function isInStartedString(edit) {
		const lastSqPairPosition = sqPositions[sqPositions.length - 1];

		return startsNonClosedString && edit >= lastSqPairPosition[0];
	}

	/******************** END: filter functions ******************/

	// checks if entire line is commented (or in string)
	if (previousLineNonClosedStrings) {
		if (closingPosition == -1) {
			return {
				missingSpaces: [],
				nonClosedStrings: true
			};
		}
	}

	return {
		missingSpaces: edits.flat()
			.filter(edit =>
				!isCommented(edit)
				&& !isInNonClosedString(edit)
				&& !isInInlineString(edit)
				&& !isInStartedString(edit)
			)
			.sort(function (a, b) { return a - b }),
		nonClosedStrings: startsNonClosedString
	}
}

function setEdit(lineCount, getLine, documentUri) {
	const edit = new vscode.WorkspaceEdit();

	// nonClosedStrings is a flag that indicates whether the current line 
	// contains non-closed string
	let nonClosedStrings = false;

	for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
		const line = getLine(lineIndex);

		// lineFormat contains information about whether the line contains non-closed string
		// and positions of missing spaces
		const lineFormat = checkLineFormat(line.text, nonClosedStrings);
		nonClosedStrings = lineFormat.nonClosedStrings;

		for (let i = lineFormat.missingSpaces.length; i > 0; i--) {
			edit.insert(documentUri, { line: lineIndex, character: lineFormat.missingSpaces[i - 1] }, " ");
		}
	}

	return edit;
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('solar2d-formatter.format2', () => {
		const { activeTextEditor } = vscode.window;

		if (activeTextEditor && activeTextEditor.document.languageId === 'lua') {
			const { document } = activeTextEditor;
			const edit = setEdit(document.lineCount, document.lineAt, document.uri);
			return vscode.workspace.applyEdit(edit);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
	checkLineFormat,
	setEdit
}
