# Schema Files

## Table of Content

<!-- TOC -->
* [Schema Files](#schema-files)
  * [Table of Content](#table-of-content)
  * [Introduction](#introduction)
  * [Structure](#structure)
<!-- TOC -->

## Introduction

Schema are information that is used to define the structure of an object broadly speaking.

While they have many applications with validation and verification of data integrity in this case they will be used to
provide some intellisense support for writing the configuration file.

## Structure

The main schema file is simply called [`./schema.json`](/docs/Schemas/schema.json) and should be used as the entry or
root schema file.

A schema file is a JSON schema and should be used to define the JSON object equivalent of object classes used in the
application.

Schemas should also provide some description of the configuration in terms of what it does to not have the user not
understand what is going on.
If the configuration is a special developer only feature or something that should not be mentioned it can be ignored
from the schema.

For further reading on the concept of JSON schemas you can read more at https://json-schema.org/