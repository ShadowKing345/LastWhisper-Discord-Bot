# Discord Bot Application Documentation Index

## Table of Content

<!-- TOC -->
* [Discord Bot Application Documentation Index](#discord-bot-application-documentation-index)
  * [Table of Content](#table-of-content)
  * [Introduction](#introduction)
  * [File Structure](#file-structure)
<!-- TOC -->

## Introduction

While there are a wide collection of Discord bot out in the market that a wide collection of administration features a
more central controlled bot is required hence the creation of this project.

The scope of the application is to provide functions and features to a Discord guild with a Bot application using the
Discord.js API library. Main features will be administrative functions such as role management and the ability to clear
a channel of its messages without destroying it, and member friendly commands and games such as voting system and flip a
coin.

## File Structure

All files, sub files and folder contained within this folder (`./docs`) are for the documentation of the application
features and functions to allow for later developers to understand the thought process of the legacy devs.

Each file will define and explain one system or function of the application. An external feature or document can be
referred to as example or if said mentioned system or function will be affected by the system or function being defined.

Subdirectories can be used to separate files and combine files that describe aspects of similar concepts such as
configurations classes, etc. Each subdirectory will contain an `index.md` file that can be used to explain the high
level logic of the files contained or provide a link to them.

The index file must do at least one of the previously mentioned functions or both.

Files names do not have any special syntax such as camel case. They should however reflect the topics being discussed
inside as well they cannot be sentences unless strictly necessary. Folder names have a similar naming convention. The
only exception to this is the `index.md` file which
can be referred to by the folder name it is contained
within.
