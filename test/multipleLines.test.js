const assert = require('assert');

const vscode = require('vscode');
const formatter = require('../extension');

suite('Multiple lines format test suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('One line document', () => {
		const text = 'something(4) [[ 4>a*2.1]]';

		const expected = [
			vscode.TextEdit.insert(new vscode.Position(0, 11), ' '),
			vscode.TextEdit.insert(new vscode.Position(0, 10), ' ')
		]

		const actual = formatter.checkAllLinesFormat(1,
			() => { return { text: text } }, 'test.lua');

		assert.deepEqual(makeReadable(actual), makeReadable(expected));
	});

	test('Multiple-lines document', () => {
		const text = ['something(4) [[ 4>a*2.1]]',
			'local a,b = 1,2',
			'local c =3',
			'local d = 4'
		];

		const expected = [
			vscode.TextEdit.insert(new vscode.Position(0, 11), ' '),
			vscode.TextEdit.insert(new vscode.Position(0, 10), ' '),
			vscode.TextEdit.insert(new vscode.Position(1, 14), ' '),
			vscode.TextEdit.insert(new vscode.Position(1, 8), ' '),
			vscode.TextEdit.insert(new vscode.Position(2, 9), ' '),
		]

		const actual = formatter.checkAllLinesFormat(text.length,
			(lineIndex) => { return { text: text[lineIndex] } }, 'test.lua');

		assert.deepEqual(makeReadable(actual), makeReadable(expected));
	});

	test('Commented', () => {
		const text = ['-- commented lines should be ignored, so 4>=(2+1) should be ok',
			'local a = 1',
			'local someBoolean = a>=3',
			'local d={1,2,3}'
		];

		const expected = [
			vscode.TextEdit.insert(new vscode.Position(2, 23), ' '),
			vscode.TextEdit.insert(new vscode.Position(2, 21), ' '),
			vscode.TextEdit.insert(new vscode.Position(3, 14), ' '),
			vscode.TextEdit.insert(new vscode.Position(3, 13), ' '),
			vscode.TextEdit.insert(new vscode.Position(3, 11), ' '),
			vscode.TextEdit.insert(new vscode.Position(3, 9), ' '),
			vscode.TextEdit.insert(new vscode.Position(3, 8), ' '),
			vscode.TextEdit.insert(new vscode.Position(3, 7), ' '),
		]

		const actual = formatter.checkAllLinesFormat(text.length,
			(lineIndex) => { return { text: text[lineIndex] } }, 'test.lua');

		assert.deepEqual(makeReadable(actual), makeReadable(expected));
	});

	test('Multi-line string', () => {
		const text = ['local stringA = "c^2" .. "=" .."B^2+ C ^ 2"',
			"local stringB= 'B'",
			'local multiLineString= [[ a^2',
			'',
			'b^2',
			'c^2),,]] a <3'
		];

		const expected = [
			vscode.TextEdit.insert(new vscode.Position(1, 13), ' '),
			vscode.TextEdit.insert(new vscode.Position(2, 21), ' '),
			vscode.TextEdit.insert(new vscode.Position(5, 12), ' '),
		]

		const actual = formatter.checkAllLinesFormat(text.length,
			(lineIndex) => { return { text: text[lineIndex] } }, 'test.lua');

		assert.deepEqual(makeReadable(actual), makeReadable(expected));
	});

	test('Multiline comment', () => {
		const text = ['local stringA = "c^2" .. "=" .."B^2+ C ^ 2"',
			"local stringB= 'B'",
			'local multiLineString= --[[ a^2',
			'',
			'b^2',
			'c^2),,]]-- a <3',
			'local CD= 31'
		];

		const expected = [
			vscode.TextEdit.insert(new vscode.Position(1, 13), ' '),
			vscode.TextEdit.insert(new vscode.Position(2, 21), ' '),
			vscode.TextEdit.insert(new vscode.Position(6, 8), ' '),
		];

		const actual = formatter.checkAllLinesFormat(text.length,
			(lineIndex) => { return { text: text[lineIndex] } }, 'test.lua');

		assert.deepEqual(makeReadable(actual), makeReadable(expected));
	});
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// if assert is wrong then vscode.WorkspaceEdit contains a lot of data not important for these use case
// making it harder to decipher what is actually the difference between the expected and actual.
// This function makes the data more readable by returning only what is important for the test.
///////////////////////////////////////////////////////////////////////////////////////////////////
// Example:
// original: 
// [
// 	i {
// 	  c: $ {
// 		c: m {
// 		  c: 0,
// 		  e: 11
// 		},
// 		e: m {
// 		  c: 0,
// 		  e: 11
// 		}
// 	  },
// 	  e: ' '
// 	},
// 	i {
// 	  c: $ {
// 		c: m {
// 		  c: 0,
// 		  e: 10
// 		},
// 		e: m {
// 		  c: 0,
// 		  e: 10
// 		}
// 	  },
// 	  e: ' '
// 	}
// ]
///////////////////////////////////////////////////////////////////////////////////////////////////
// Transforms to:
// [
// 	{
// 	  character: 11,
// 	  line: 0
// 	},
// 	{
// 	  character: 10,
// 	  line: 0
// 	}
// ]
function makeReadable(edits) {
	return edits.map((edit) => {
		return {
			line: edit.range.start.line, character: edit.range.start.character
		}
	});
}