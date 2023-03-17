# Code Structure and Building

## Table of Content

<!-- TOC -->
* [Code Structure and Building](#code-structure-and-building)
  * [Table of Content](#table-of-content)
  * [Code Structure](#code-structure)
  * [Building](#building)
<!-- TOC -->

## Code Structure

The application is written in Typescript (ts for short) which is compiled down to Javascript (js for short) to allow for
native node running without the need of additional dependencies to be downloaded for production runs.

The configuration file for ts can be found at [`tsconfig.json`](/tsconfig.json) at the project root.
The application is also written in `esm` modules for generally simpler importing of files and due to some packages being
esm modules only.

## Building

Compiled files are located in the `build` directory at the project root on build and can be generated with the `build`
command found in the [`package.json`](/package.json) file.

Building primarily uses the Typescript compiler to build and so will first remove the current build directory. It is
highly recommended to not leave anything important in there.

*Note:*
Unlike other projects this one intentionally has js as a normal dependency and not a development dependency. This is
because you are expected to compile the application first before you run it normally.
This is what occurs with the Dockerfile which will compile the application.