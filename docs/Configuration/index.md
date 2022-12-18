# Configuration and Configuration Files

## Table of Contents

<!-- TOC -->
* [Configuration and Configuration Files](#configuration-and-configuration-files)
  * [Table of Contents](#table-of-contents)
  * [Configuration Files](#configuration-files)
  * [Configuration](#configuration)
<!-- TOC -->

## Configuration Files

Configuration files are to be stored inside the [`config`](/config) directory found in the project root.

The name of the files shall be as follows, `{configuration-type}.json`. By default, the `configuration-type` placeholder
should be default however you can create a development file used for development instead.

A dev or production configuration should overwrite the common configuration values. You can also change which type will
be used by changing the NODE_ENV variable.

## Configuration

The configuration is a key value map of all values that alter application behavior.
A configuration entry can be an object or a single value. Additionally, there should be some level of type safety
involved to not allow the user to enter odd values.