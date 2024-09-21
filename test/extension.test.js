const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const myExtension = require('../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Missing space in parentheses', () => {
		const text = 'if ( string.find(file, ".html") ) then';

		const expected = [17, 30];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('Missing space in closing parenthesis', () => {
		const text = 'if ( string.find( file, ".html") ) then';

		const expected = [31];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('Proper spaces', () => {
		const text = 'if ( string.find( file, ".html" ) ) then';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('No parameters', () => {
		const text = 'someFunction()';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('Multiple brackets missing spaces', () => {
		const text = 'if (string.find(file, ".html")) then';

		const expected = [4, 16, 29, 30];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('Sequence of two opening parentheses', () => {
		const text = 'if ((file, ".html" ) ) then';

		const expected = [4, 5];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('Sequence of 3 opening parentheses', () => {
		const text = '(((a';

		const expected = [1, 2, 3];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('missing places in more complex parentheses structure', () => {
		const text = 'if (a * (b-(4+c) * (2^a ) )) then';

		const expected = [4, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 27];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('Sequence of closing parentheses missing space', () => {
		const text = 'if ( ( file, ".html")) then';

		const expected = [20, 21];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('sda', () => {
		const text = 'local testTable = {}';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('sda2', () => {
		const text = 'local testTable = {0 }';

		const expected = [19];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('sda3', () => {
		const text = 'local testTable = { 0}';

		const expected = [21];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('sda4', () => {
		const text = 'local testTable = {0, 4}';

		const expected = [19, 23];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('comment', () => {
		const text = '-- ok comment';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('ok comment', () => {
		const text = '------------ long coment';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('nok comment', () => {
		const text = '------------';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('nok comment', () => {
		const text = 'someOkCode() -- 4+6-8=2';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('nok comment', () => {
		const text = 'someNonOkCode(4,5) -- 4+6-8=2';

		const expected = [14, 16, 17];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('+', () => {
		const text = '4+5';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('+', () => {
		const text = 'a+ 5';

		const expected = [1];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('+', () => {
		const text = 'local b = a + 5';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('*', () => {
		const text = '4*5';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('*', () => {
		const text = 'a* 5';

		const expected = [1];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('*', () => {
		const text = 'local b = a * 5';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('/', () => {
		const text = '4/5';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('/', () => {
		const text = 'a /5';

		const expected = [3];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('/', () => {
		const text = 'local b = a / 5';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('%', () => {
		const text = '4%5';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('%', () => {
		const text = 'a %5';

		const expected = [3];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('%', () => {
		const text = 'local b = a % 5';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('^', () => {
		const text = '4^5';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('^', () => {
		const text = 'a ^5';

		const expected = [3];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('^', () => {
		const text = 'local b = a ^ 5';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('>', () => {
		const text = 'a>b';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('>', () => {
		const text = 'a >b';

		const expected = [3];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('>', () => {
		const text = 'local b = a > b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('<', () => {
		const text = 'a<b';

		const expected = [1, 2];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('<', () => {
		const text = 'a <b';

		const expected = [3];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('<', () => {
		const text = 'local b = a < b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test(',', () => {
		const text = 'local a,b = 1,2';

		const expected = [8, 14];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test(',', () => {
		const text = 'local a, b = 1, 2';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test(',', () => {
		const text = '{ 0,1,2,3,4,5 }';

		const expected = [4, 6, 8, 10, 12];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('=1', () => {
		const text = 'local a = 4';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('==', () => {
		const text = 'local isEqual = a == b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('==', () => {
		const text = 'local isEqual = a==b';

		const expected = [17, 19];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('=2', () => {
		const text = 'local isEqual =a == b';

		const expected = [15];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('=3', () => {
		const text = 'local isEqual=a==b';

		const expected = [13, 14, 15, 17];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('>=', () => {
		const text = 'local isEqual = a>=b';

		const expected = [17, 19];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('>=', () => {
		const text = 'local isEqual = a >= b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('<=', () => {
		const text = 'local isEqual = a<=b';

		const expected = [17, 19];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('<=', () => {
		const text = 'local isEqual = a <= b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('~=', () => {
		const text = 'local isEqual = a ~= b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('~=', () => {
		const text = 'local isEqual = a~=b';

		const expected = [17, 19];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('-', () => {
		const text = 'local isEqual = a - b';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('-', () => {
		const text = 'local isEqual = a-b';

		const expected = [17, 18];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = '\'<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">\'';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = "'1%2+3'";

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = '"1%2+3"';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = 'local b = a == "4^c" and "some-string" or "=0,another/%string%"';

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = "local b = a == '4^c' and 'some-string' or '=0,another/%string%'";

		const expected = [];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});

	test('string', () => {
		const text = 'something(4 ) [[ 4>a*2.1]]';

		const expected = [10];
		const actual = myExtension.checkLineFormat(text).missingSpaces;

		assert.deepEqual(actual, expected);
	});
});
