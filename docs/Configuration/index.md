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

The name of the files shall be as follows, `ProjectConfiguration.{config type}.json`. The config type placeholder
denotes if it is a dev configuration, a production configuration or a command configuration.

A dev or production configuration should overwrite the common configuration values.

## Configuration

The configuration is a key value map of all values that alter application behavior.
A configuration entry can be an object or a single value. Additionally, there should be some level of type safety
involved to not allow the user to enter odd values.