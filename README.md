# Last Whisper Discord Bot

The Discord bot for the Final Fantasy XIV Last Whisper free company Discord server.

## Table of contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Commands Setup](#command-setup)
    - [Guild Specific Command Setup](#guild-specific-command-setup)

## Features of the Discord bot

- Periodically post a message about the buff for the day.
- Event scheduling and posting of reminders by parsing messages.
- Role manager.

## Getting Started

You will need to have Node.js version 16 and up in order to be able to run this application. For the database a MongoDB
database is needed.

Clone, Download/unzip this project into your desired location.

```bash
git clone https://github.com/ShadowKing345/LastWhisper-Discord-Bot.git Discord-Bot
```

*Note: The folder name was used in later command examples.*

From here simply enter the file and download the node packages used for production.

```bash
yarn 

npm install #if you are planning on using npm instead of yarn.
```

Once all the packages are installed simply run the start script.

```bash
yarn run start #yarn start for some sugar syntax

npm run start
```

The bot will begin the setup process, connect to the database and Discord API and start.
*Note: Assuming you have not configured the bot it will defiantly fail and throw errors.*
However, this is done to just confirm that the environment is set up correctly.

## Configuration

The bot uses a standard JSON file for its configuration. The file name is `appConfigs.json` and should be place at the
project root. The minimum needed to get the bot up and running is just the database URL for MongoDB and the bot token
which can be acquired.

The token can be acquired by going to [Discord Developer Applications](https://discord.com/developers/applications) and
creating a new application getting the token from there.
*See: [Discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) for a
more detailed guide*

Once you have acquired this information you can create a `appConfigs.json` file at the project root and have the
following data.

```json
{
  "token": "[Discord Bot Token]",
  "database": {
    "url": "[MongoDB URL]"
  }
}
```

Once this has been saved you should be able to run the application and have the bot be live on your server and should
show ready to run message on the console.

The bot also comes with a script for generating the configuration file as well as updating the existing
one. `yarn run generate-config`.

A schema is also available as well [here]().

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

*Note: Unregister is actually not needed, but I would recommend keeping it so that you can easily toggle it without
having to look through documentation or dealing with configuration tool.*

Once the configuration file has been saved you can simply run.

```bash
yarn run command-setup

npm run command-setup
```

After this wait and the slash commands will be updates. It may take a long amount of time.

Unregistering the commands are as simple as setting unregister to true and running the command again. It will unregister
all the commands.

### Guild Specific Command Setup

If you don't want to have the global commands or wish to have them instantly available or are just testing / developing
the bot, you can set up the slash commands for a specific guild. You will need the guild ID for the guild you wish to
add the slash commands for.

In the application configuration inside commandRegistration add the following.

```json
{
  "guildId": "[Guild ID]",
  "registerForGuild": true
}
```

*Note: You can set `registerForGuild` to false, and it will still register globally instead of the guild. You can keep
the guildId.*

One thing to mention is that guild command and global commands do not stack so if you have registered both of them you
will see two entries in the slash command.

Anything thing to note is that guild command will stay after the bot leaves so its recommend unregistering them if you
wish to remove the bot. Global commands do not do this.
