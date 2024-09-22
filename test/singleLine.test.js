const assert = require('assert');

const vscode = require('vscode');
const formatter = require('../extension');

suite('Single line format test suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('() 1', () => {
        const text = 'if ( string.find(file, ".html") ) then';

        const expected = [17, 30];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 2', () => {
        const text = 'if ( string.find( file, ".html") ) then';

        const expected = [31];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 3', () => {
        const text = 'if ( string.find( file, ".html" ) ) then';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 4', () => {
        const text = 'someFunction()';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 5', () => {
        const text = 'if (string.find(file, ".html")) then';

        const expected = [4, 16, 29, 30];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 6', () => {
        const text = 'if ((file, ".html" ) ) then';

        const expected = [4, 5];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 7', () => {
        const text = '(((a';

        const expected = [1, 2, 3];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('complex', () => {
        const text = 'if (a * (b-(4+c) * (2^a ) )) then';

        const expected = [4, 9, 10, 11, 12, 13, 14, 15, 20, 21, 22, 27];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('() 8', () => {
        const text = 'if ( ( file, ".html")) then';

        const expected = [20, 21];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('{} 1', () => {
        const text = 'local testTable = {}';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('{} 2', () => {
        const text = 'local testTable = {0 }';

        const expected = [19];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('{} 3', () => {
        const text = 'local testTable = { 0}';

        const expected = [21];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('{} 4', () => {
        const text = 'local testTable = {0, 4}';

        const expected = [19, 23];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('-- 1', () => {
        const text = '-- ok comment';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('-- 2', () => {
        const text = '------------ long coment';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('-- 3', () => {
        const text = '------------';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('-- 4', () => {
        const text = 'someOkCode() -- 4+6-8=2';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('-- 5', () => {
        const text = 'someNonOkCode(4,5) -- 4+6-8=2';

        const expected = [14, 16, 17];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('+ 1', () => {
        const text = '4+5';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('+ 2', () => {
        const text = 'a+ 5';

        const expected = [1];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('+ 3', () => {
        const text = 'local b = a + 5';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('* 1', () => {
        const text = '4*5';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('* 2', () => {
        const text = 'a* 5';

        const expected = [1];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('* 3', () => {
        const text = 'local b = a * 5';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('/ 1', () => {
        const text = '4/5';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('/ 2', () => {
        const text = 'a /5';

        const expected = [3];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('/ 3', () => {
        const text = 'local b = a / 5';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('% 1', () => {
        const text = '4%5';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('% 2', () => {
        const text = 'a %5';

        const expected = [3];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('% 3', () => {
        const text = 'local b = a % 5';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('^ 1', () => {
        const text = '4^5';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('^ 2', () => {
        const text = 'a ^5';

        const expected = [3];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('^ 3', () => {
        const text = 'local b = a ^ 5';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('> 1', () => {
        const text = 'a>b';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('> 2', () => {
        const text = 'a >b';

        const expected = [3];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('> 3', () => {
        const text = 'local b = a > b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('< 1', () => {
        const text = 'a<b';

        const expected = [1, 2];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('< 2', () => {
        const text = 'a <b';

        const expected = [3];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('< 3', () => {
        const text = 'local b = a < b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test(', 1', () => {
        const text = 'local a,b = 1,2';

        const expected = [8, 14];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test(', 2', () => {
        const text = 'local a, b = 1, 2';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test(', 3', () => {
        const text = '{ 0,1,2,3,4,5 }';

        const expected = [4, 6, 8, 10, 12];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('= 1', () => {
        const text = 'local a = 4';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('== 1', () => {
        const text = 'local isEqual = a == b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('== 2', () => {
        const text = 'local isEqual = a==b';

        const expected = [17, 19];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('= 2', () => {
        const text = 'local isEqual =a == b';

        const expected = [15];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('= 3', () => {
        const text = 'local isEqual=a==b';

        const expected = [13, 14, 15, 17];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('>= 1', () => {
        const text = 'local isEqual = a>=b';

        const expected = [17, 19];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('>= 2', () => {
        const text = 'local isEqual = a >= b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('<= 1', () => {
        const text = 'local isEqual = a<=b';

        const expected = [17, 19];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('<= 2', () => {
        const text = 'local isEqual = a <= b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('~= 1', () => {
        const text = 'local isEqual = a ~= b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('~= 2', () => {
        const text = 'local isEqual = a~=b';

        const expected = [17, 19];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('- 1', () => {
        const text = 'local isEqual = a - b';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('- 2', () => {
        const text = 'local isEqual = a-b';

        const expected = [17, 18];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('string 1', () => {
        const text = '\'<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">\'';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('string 2', () => {
        const text = "'1%2+3'";

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('string 3', () => {
        const text = '"1%2+3"';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('string 4', () => {
        const text = 'local b = a == "4^c" and "some-string" or "=0,another/%string%"';

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('string 5', () => {
        const text = "local b = a == '4^c' and 'some-string' or '=0,another/%string%'";

        const expected = [];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('string 6', () => {
        const text = 'something(4 ) [[ 4>a*2.1]]';

        const expected = [10];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('--[[ 1', () => {
        const text = 'something(4 ) --[[ 4>a*2.1]]--';

        const expected = [10];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('--[[ 2', () => {
        const text = 'something(4 ) --[[ 4>a*2.1';

        const expected = [10];
        const actual = formatter.checkLineFormat(text).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test(']]-- 1', () => {
        const text = 'c^2),,]]-- a <3';

        const expected = [];
        const actual = formatter.checkLineFormat(text, true).missingSpaces;

        assert.deepEqual(actual, expected);
    });

    test('tab', () => {
        const text = '	}';

        const expected = [];
        const actual = formatter.checkLineFormat(text, true).missingSpaces;

        assert.deepEqual(actual, expected);
    });
});
