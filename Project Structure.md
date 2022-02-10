# Project Structure

## Introduction

Within this document contains the general structure of the contained project as well as additional information such as structure of configuration, definition of key terms, and debugging information to name a few.

The purpose of this document is to keep a reminder of how the application structure was developed and allow for consistency when developing its different modules for the current and any future developers.

## File Structure

The project uses a controller, service, and repository approach to managing its files. However, controllers are renamed to be called modules instead as they do no directly provide API calls or endpoints but instead use the discord.js event calls to process the information.

```
root                                  # Root of project.
|-package.json                        # Node.js file containing all package information, scripts and dependencies.
|-tsconfig.json                       # Typescript compiler configuration file.
|-Dockerfile / docker-compse.yml      # Docker files.
|-build    # Designation for the transpiled code.
\-src      # Source code folder.
    |-test # Directory containing all test files.
    \-main # Directory with main source code.
        |-classes        # Contains all the classes used through the project. Not be too confused with database models.
        |-config         # Contains all scripts that handle project setup and configuration.
        |    \-commandRegistration    # Specifically manages discord slash command registration and modification.
        |-models         # Contains all database models used in the project.
        |-modules        # Contains all modules that handle discord bot processing. Including command execution, tasks, and listeners.
        |-repositories   # Contains all classes that interact with the database in some capacity.
        |-services       # Contains all services used through the project. Or acts like a middle man between the repository and module.
        |-utils          # Contains all helper and utility classes such as fetching messages and the logger.
        \-app.ts         # Main entry point for the project. Running this script will begin the initialization process.
```

## Logger

The logger handles how information is presented to the command line or saved into a file. Currently, the project is using Winston as its logger as the default JavaScript is not ideal for complex logging.

The format for the logger is as follows.

```
[<Time stamp (YYYY-MM-DD hh:mm:ss)>] [<Logger leve>] <context>: <message>
```

The context should be used to denote where the log is coming from. For example, if the context is a repository it should read as "\<RepositoryName>Repository" when logged.

### Colors

Colors are used to denote what type of information is being presented and the context. If the information is a simple generic message then the color will be left as default to the terminal or log out put used. The color meanings are as follows.

- For the logger level:

```
Color        |    Meaning or usage
======================================
Red          |    Errors
Yellow       |    Warnings
White        |    Information
Blue         |    Debug
```

- For the logger message:

```
Color        |    Meaning or usage
===============================================================================================================
White        |    Modules / Services / Repositories
Blue         |    Models / Class objects.
Yellow       |    Information provided by the client. Eg, guildId, clientId, messageID
Magenta      |    Bot event specific actions. Eg, ready message, interaction invocation, on error messages.
Cyan         |    Actions executed internally. Setup of commands for example.
Green        |    Successfully execution or initialization. Think of it as something good has happened.
Red          |    Failure of execution or initialization. Think of it as something bad has happened. 
```

In case of too many logger calls preventing your for seeing the information in the terminal property, you can use a background color such as bgRed. This however should only be used for at the time debugging information and should not be left in. Any color can be used as these logger calls are temporary.

### Special Message Formatting

Formatting the text of a message to be bold, underlined, strike through, or any combination is allowed for emphasis of the meaning of the message and does not have restrictions other than to follow proper grammar rules.

UwU, OwO, pirate or sarcastic speech should not be used other than as an April Fools' joke in the Debugging level of the logger (You can use it in the comments of your code tho uwu). 