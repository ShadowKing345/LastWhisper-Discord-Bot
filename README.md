# Last Whisper Discord Bot

The Discord bot for the Final Fantasy XIV Last Whisper free company Discord server.

## Table of contents

- [Getting Started](#getting-started)
    - [Yarn](#yarn)
    - [NPM](#npm)
    - [Docker](#docker)
- [Configuration](#configuration)
- [Commands Setup](#command-setup)
    - [Guild Specific Command Setup](#guild-specific-command-setup)
- [Advanced Configuration](#advanced-configuration)
    - [Environment Variables](#environment-variables)
    - [Logger](#logger)
    - [Command Arguments](#command-arguments)
- [Development](#development)
    - [Additional Configuration](#additional-configuration-file)
    - [Project Setup](#project-setup)
    - [Pull Requests](#pull-requests)
- [Special Thanks](#special-thanks)

## Features of the Discord bot

- Periodically post a message about the buff for the day.
- Event scheduling and posting of reminders by parsing messages.
- Role manager.

## Getting Started

To begin with, clone / Download / unzip this project to your desired location.

```shell
git clone https://github.com/ShadowKing345/LastWhisper-Discord-Bot.git Discord-Bot
```

_Note: The folder name was used in later command examples._

### Local runs

_You will need to have Node.js version 19 to be able to run this application safely. For the database, the application
was created with postgresql in mind._

You can run the application locally. This may be the simplest but also requires you to build the application as by
default it comes in the raw TS code (to save space and ensure everyone get the latest build)

_Note: This project uses mainly yarn as its package manager but you can also use npm. Keep in mind the command syntax is
different for npm compared to yarn._

```shell
yarn --production # To install the production packages.
yarn build # To build the application.
```

Once everything has been installed and compiled / build. You will need to create the [configuration](#configuration) and
run the application with.

```shell
yarn run start
```

For more information about all the command you can look through the help documentation with the `--help` argument.

### Docker

Docker provides one of the simplest ways to get a running version of the application running. This project wont be
making it simple. We have include a [Dockerfile](./Dockerfile) that you can use to make a container image to use but we
do not provide a container file or run command for how to run the application.

We found it rather error prone to attempt to explain this. We can say that you need to have a volume setup for
the `config` directory in `/var/app/config` for the container. Additionally, this docker file does not contain a run
command by default so you will need to create one yourself.

## Configuration

All configurations can be found under the config directory. This folder is ignored by git so you can put anything in
there that may be useful to you. The main configuration file for the application is called `common.json` it is a json
file containing all the configurations needed for the application.

Normally, most of the default configuration should be fine but there are some you have to provide. The bot token and
application ID are needed for command registration and general bot configuration.

Below you can find an example json configuration including a schema path.

```json
{
  "$schema": "./docs/Schemas/schema.json",
  "token": "[Your token]",
  "commandRegistration": {
    "clientId": "[Your bots client ID]"
  }
}
```

_Note: The schema path may be pointing in the wrong directory._

Obviously, this is the most bare bones configuration to ensure the application can at least connect to Discord. You will
need to provide configuration for the database and ensure that the commands are set up correctly.

## Command Setup

To register all the commands needed for the users to interact with the application you will need to have the command
registration set correctly with the client ID. From there simply run the `commandManager` subcommand with a optional
unregister to unregister the commands

```shell
yarn run start commandManager register
```

You can run `--help` as an argument to see what else the command can do.

### Guild Specific Command Setup

For registering commands specific to a guild you will need to set the `guildId` and `registerForGuild` under
the `commandRegistration` section for the configuration files. Simply run the command again and it should register it.

## Advanced configuration

Things to note:

- While a majority of configuration can be done you may have to manually enter the database and edit config files.
- Advanced configuration is still an on going project as we try to add various method to configure the application. If
  something is missing it stands to reason we have not gotten around to it yet.

### Environment Variables

Environment variables are used to configure the application and change small behaviors.

### Logger

This project uses pino logger to structure the logs in a way that can be easily parsed. You can use the configurations
to easily add a file logger transport and or pretty print logger.

I recommend reading the page on transports found (here)[https://github.com/pinojs/pino/blob/master/docs/transports.md]
as a majority of the important information can be found there about transports.

The ORM also uses the logger to print out information about the database. This is a separate configuration to the normal
logger as there are more options to dynamically change what is logged.

### Command arguments

Instead of using the configuration file you can simply pass the configuration you want to the command as arguments. Use
`--help` to get a list of additional argument and what they mean. _Note: Not all configuration options have a command
argument._

## Development

If you wish you develop the application further adding your own fixes and features there are a small amount of things to
note.

### Additional Configuration File

The `common.json` has a sister file which can be used when developing the project. `development.json` is a special file
that will overwrite all options found in the regular configuration file.

### Project setup

The project is generally written with Typescript from the start. As such it is generally recommended to have a good IDE
that can handle Typescript.

Pino-pretty is included as a dev dependency to allow for easily readable debug messages.

_Note: If by chance there is an important dev package missing please send an issue as it is very possible that the
package was installed globally and not locally._

This project mainly uses yarn as it package manager as well. While npm is alright to use for personal reasons, it is
recommended to use yarn generally speaking for this project.

There are also node scripts provided to run the dev tasks such as `nodemon`.

### Pull requests

When posting a pull request to fix an issue or add features kindly include a detailed description of the fix / feature
and ensure all the necessary files are included.

Additionally, only include the files vital to the change. A variable rename outside the context of the pull request will
be rejected for example.

## Special Thanks

A Special thanks to a close friend who encouraged and helped with the creation and maintenance of this bot.

Another Special thanks to the entire Last Whisper community who either directory or indirectly helped with the
development of this application.

[Back to top](#table-of-contents)
