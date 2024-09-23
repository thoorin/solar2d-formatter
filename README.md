# Solar2D-Formatter

Solar2D-Formatter is Visual Studio Code extension designed to be used for development of Solar2D apps. Majority of lua formatters are not compatible with Solar2D code style as shown in its official documentation and examples.

## Features

Adds missing spaces - for example `local someFunc=function(a,b,c) return a+b*c end`<br /> is formatted into ```local someFunc = function( a, b, c ) return a + b * c end```

## Release Notes



### 1.0.0

Initial release DATE

## Project structure

Implementation of the formatter is in the file extension.js. Tests are in the tests folder and are
divided into singleLine test, that checks proper formatting of a checkLine function, and into
multipleLines test, that tests checkAllLines function. Since checkAllLines function calls 
checkLine function for each line, both tests differ only in the abstraction level. This means that
multiLine tests are closer approximation of what the user is doing and therefore are more valuable.
SingleLine tests still help with quicker identification of regression bugs, however since they are
implementation tests, feel free to rewrite them or even delete them if the implementation changes significantly.

## Useful commands

Run the tests with:
`npm run test`