const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const myExtension = require('../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('string', () => {
		const text = 'something(4) [[ 4>a*2.1]]';

		const expected = [
			new vscode.TextEdit(new vscode.Range(0, 11, 0, 11), ' '),
			new vscode.TextEdit(new vscode.Range(0, 10, 0, 10), ' ')
		]

		const actual = myExtension.setEdit(1, (lineIndex) => { return { text: text } }, 'test.lua').entries()[0][1];

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = ['something(4) [[ 4>a*2.1]]',
			'local a,b = 1,2',
			'local c =3',
			'local d = 4'
		];

		const expected = [
			new vscode.TextEdit(new vscode.Range(0, 11, 0, 11), ' '),
			new vscode.TextEdit(new vscode.Range(0, 10, 0, 10), ' '),
			new vscode.TextEdit(new vscode.Range(1, 14, 1, 14), ' '),
			new vscode.TextEdit(new vscode.Range(1, 8, 1, 8), ' '),
			new vscode.TextEdit(new vscode.Range(2, 9, 2, 9), ' '),
		]

		const actual = myExtension.setEdit(text.length, (lineIndex) => { return { text: text[lineIndex] } }, 'test.lua').entries()[0][1];

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = ['-- commented lines should be ignored, so 4>=(2+1) should be ok',
			'local a = 1',
			'local someBoolean = a>=3',
			'local d={1,2,3}'
		];

		const expected = [
			new vscode.TextEdit(new vscode.Range(2, 23, 2, 23), ' '),
			new vscode.TextEdit(new vscode.Range(2, 21, 2, 21), ' '),
			new vscode.TextEdit(new vscode.Range(3, 14, 3, 14), ' '),
			new vscode.TextEdit(new vscode.Range(3, 13, 3, 13), ' '),
			new vscode.TextEdit(new vscode.Range(3, 11, 3, 11), ' '),
			new vscode.TextEdit(new vscode.Range(3, 9, 3, 9), ' '),
			new vscode.TextEdit(new vscode.Range(3, 8, 3, 8), ' '),
			new vscode.TextEdit(new vscode.Range(3, 7, 3, 7), ' '),
		]

		const actual = myExtension.setEdit(text.length, (lineIndex) => { return { text: text[lineIndex] } }, 'test.lua').entries()[0][1];

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = ['local stringA = "c^2" .. "=" .."B^2+ C ^ 2"',
			"local stringB= 'B'",
			'local multiLineString= [[ a^2',
			'',
			'b^2',
			'c^2),,]] a <3'
		];

		const expected = [
			new vscode.TextEdit(new vscode.Range(1, 13, 1, 13), ' '),
			new vscode.TextEdit(new vscode.Range(2, 21, 2, 21), ' '),
			new vscode.TextEdit(new vscode.Range(5, 12, 5, 12), ' '),
		]

		const actual = myExtension.setEdit(text.length, (lineIndex) => { return { text: text[lineIndex] } }, 'test.lua').entries()[0][1];

		assert.deepEqual(actual, expected);
	});
});
