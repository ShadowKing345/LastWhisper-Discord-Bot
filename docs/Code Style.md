# Code Styles and Prettier

## Table of Content

<!-- TOC -->
* [Code Styles and Prettier](#code-styles-and-prettier)
  * [Table of Content](#table-of-content)
  * [Code Styles](#code-styles)
<!-- TOC -->

## Code Styles

The application will be using a linter called [`eslint`](https://eslint.org/). Its configuration file can be found
at [`.eslint.cjs`](/.eslintrc.cjs) and ignored files are found in [`.eslintignore`](/.eslintignore) to exclude certain
files and folders.

As this is a ts project the ts plugin and extensions have been added to the configuration file.

To test the linter you can run `lint`. You can also tell eslint to attempt to fix the error for you where it can
with `lint-fix`. Both commands can be found in [`package.json`](/package.json)