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

You will need to have Node.js version 16 and up in order to be able to run this application. For the database a MongoDB
database is needed.

Clone, Download/unzip this project into your desired location.

```shell
git clone https://github.com/ShadowKing345/LastWhisper-Discord-Bot.git Discord-Bot
```

_Note: The folder name was used in later command examples._

### Yarn

From here simply enter the folder downloaded(cloned) and download the node packages used for production.

```shell
yarn --production
```

Once all the packages are installed simply run the start script.

```shell
yarn run start
```

The bot will begin setting up internal variables and start running. _Note: Assuming you have not configured the bot it
will defiantly fail and throw errors._ However, this is done to just confirm that the environment is set up correctly.

### NPM

If you are using node package manager instead of yarn you can run the following instead

```shell
npm install --production
npm run start
```

### Docker

For a more simplified and straight forward installation a [`docker-compose.yml`](docker-compose.yml) and
[`Dockerfile`](Dockerfile) can be found in the root of the project. The docker configuration is a minimal setup with as
few commands as possible. For additional features such as volumes in case of storing logs, you can use
[docker volumes](https://docs.docker.com/storage/volumes/).

## Configuration

The bot uses a standard JSON file for its configuration. For separation from all the other configuration files for the
project application configuration files are stored under the `config` directory root of the project. For the most basic
of configuration a token and MongoDB database url. (It feels redundant to call say database twice)

The token can be acquired by going to [Discord Developer Applications](https://discord.com/developers/applications) and
creating a new application getting the token from there. _See:
[Discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) for a more
detailed guide_

The MongoDB can be acquired with a local database instance or using the database cloud services provided by MongoDB or
other cloud hosting services. Sadly I am not confident enough to provide a definitive guide to getting this url.

Once you have acquired this information you can create a `ProjectConfiguration.json` file in the `config` folder root of
the project. Simply provide the following.

```json
{
  "$schema": "docs/schema.json",
  "token": "[Your Discord bot token]",
  "database": {
    "url": "[The MongoDB DB url]"
  }
}
```

Assuming everything is configured correctly you can simply run the bot application without any issues.

_Note: It is possible that the `config` folder is not created at the root at the project. You can simply create it if
this is the case._

```shell
mkdir config
```

_Note: A schema file is also provided to help with configuration of the bot. It can be found under
[`docs/schema.json`](docs/schema.json). Presuming the text editor you are using can handle JSON schemas. Additionally,
if you are having issues seeing the schema try use `../docs/schema.json` instead._

## Command Setup

The bot uses slash commands which require manual registration. For this to work you will need the application ID for the
bot. In the configuration file add the following or use the configuration script.

```json
{
  "commandRegistration": {
    "clientId": "[Bot Application Id]",
    "unregister": false
  }
}
```

_Note: Unregister is actually not needed, but I would recommend keeping it so that you can easily toggle it without
having to look through documentation or dealing with configuration tool._

Once the configuration file has been saved you can simply run.

```bash
yarn run register-commands

npm run register-commands
```

After this wait and the slash commands will be updates. It may take a long amount of time for the commands to be
registered globally.

Unregistering the commands are as simple as setting unregister to true and running the command again. It will unregister
all the commands.

### Guild Specific Command Setup

If you don't want to have the global commands or wish to have them instantly available, you can set up the slash
commands for a specific guild. You will need the guild ID for the guild you wish to add the slash commands for.

In the application configuration inside commandRegistration add the following.

```json
{
  "guildId": "[Guild ID]",
  "registerForGuild": true
}
```

_Note: The guild ID does nothing by itself, so you can leave it there. Only the `registerForGuild` setting will trigger
the register for guild procedure._

One thing to mention is that guild command and global commands do not stack so if you have registered both of them you
will see two entries in the slash command.

## Advanced configuration

Things to note:

- While a majority of configuration can be done you may have to manually enter the database and edit config files.
- The project uses pino for its logger library. Pino has the ability to add additional transports which can be
  configured by editing the `logger.transports` object in `ProjectConfiguration.json`.

### Environment Variables

There are special environment variables that can be set to change how the application handles certain tasks. For example
the `CONFIG_PATH` variable sets the file path for the `ProjectConfiguration.json` file. \*Note: It's the file path and
not the folder path.

### Logger

I recommend reading the page on transports found ( here)[https://github.com/pinojs/pino/blob/master/docs/transports.md]
as a majority of the important information can be found there.

### Command arguments

Instead of using the configuration file you can simply pass the configuration you want to the command as arguments. Use
`--help` to get a list of additional argument and what they mean. _Note: Not all configuration options have a command
argument._

## Development

If you wish you develop the application further adding your own fixes and features there are a small amount of things to
note.

### Additional Configuration File

The `ProjectConfiguration.json` has a sister file which can be used when developing the project.
`ProjectConfiguration.dev.json` is a special file that will overwrite all options found in the regular configuration
file.

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
