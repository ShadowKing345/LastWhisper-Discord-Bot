Please be aware that this branch is a large work in progress as discord.py is no longer being supported actively (thanks
Discord), so the majority of the readme will be for the docker branch.

# LastWhisper-Discord-Bot

This is the code for the discord bot of The Last Whisper Free Company in the game Final Fantasy XIV.

## Table of contents:

- [Features of the Discord bot](#features-of-the-discord-bot)
- [Prerequisites](#prerequisites)
    - [Docker](#docker)
    - [Manual](#manual)
- [Installation](#installation)
    - [Step 1](#step-1-bot-application-setup)
    - [Step 2](#step-2-clone-the-repo)
    - [Step 3](#step-3-token-setup)
    - [Step 4](#step-4-system-setup-and-running)
        - [Docker Compose](#docker-compose)
        - [Manual Launch](#manual-launch)
            - [Step 4.1](#step-41-python-environment)
            - [Step 4.2](#step-42-running-the-bot)

## Features of the Discord bot:

* Periodically post a message about the buff for the day.
* Config manager that allows for changing of setting from Discord.
* Config framework allowing for 3RD party Cogs to utilize the Config Manager Cog.
* Extension Manager Cog that allows for managing of extension files (WIP).

## Prerequisites

### Docker

A docker file has been provided along with a docker composer file. Assuming you have the docker setup correctly on your
machine this should be the simplest method of setting up.

Prerequisites:

* Docker Compose (docker-compose), Version 3.5

### Manual

* Python 3.8 or above.
* discord.py Python libraries.

## Installation

### Step 1: Bot Application Setup.

Create the bot application from the [Discord Developer Page](https://discord.com/developers/applications) and have it be
setup as a bot application. If you have don't it correctly you be able to copy something specifically referred to as a
Token. If not the [discord.py](https://discordpy.readthedocs.io/en/stable/discord.html) provides a better set of
instructions for setting up the bot and inviting it to the server.

### Step 2: Clone The Repo.

Clone the repo into the desired location.

```shell
git clone https://github.com/ShadowKing345/LastWhisper-Discord-Bot.git
```

Downloading the Zip file would be an equivalent option.

### Step 3: Token Setup.

`Small note about security:`
The token is one of the requirements needed to communicate with Discord. Think of it as a password or the remote control
of the bot. Once someone has it they can do whatever with the bot. Therefore, the system you have it in should be well
protected to what you find reasonable. Sadly while encrypting it might be a solution the default bot does support
decryption.

Create a file called `token` inside the `secrets` directory. Copy the token from the website and simply paste it inside
the `token` file.

### Step 4: System Setup And Running.

#### Docker Compose

If you are planning on running a docker image and have both docker and docker-compose correctly set up then all you have
to do is simply run `docker-compose up` at the root of the cloned project.

```shell
docker-compose up
```

The docker image and container will simply set up and the bot will begin to run. To which case you are most likely done
unless you have errors.

#### Manual Launch.

Manual setup is a different beast to deal with. To begin with lets set up the python environment and prerequisites.

##### Step 4.1: Python environment.

`Small warning for Windows users.` All the python commands may be referred to as `py` instead of `python`. I can see
reference of both being used however as this guide was created with a linux OS in mind most of the following commands
are expected to run in a Linux command line environment.

First ensure you have a version of python that is or above 3.8. Simply doing:

```shell
python --version
```

Will return the python version.

Next download the libraries needed to run the bot. These can be
found [here](https://github.com/ShadowKing345/LastWhisper-Discord-Bot/blob/docker/requirements.txt) and manually
installed (Granted the all at one go file does sound pretty nice.)

```shell
pip install -r requirements.txt
# Or use the full python module call (cause I always have issues seeing pip)
python -m pip install -r requirements.txt
```

#### Step 4.2: Running the bot.

To begin with, you need to ensure you are inside the correct directory when you execute the bot. This is because
manually running python scripts will set the current directory as the working directory instead of the one were the file
actually exists.

So from the git project root simply change directory into the bot directory.

```shell
cd ./bot
```

From here simply just tell python to begin executing the script.

```shell
python client.py
```

Assuming everything is fine it should simply run without errors.

[Back to top](#lastwhisper-discord-bot)

## Troubleshooting.

- `Bot complaining about token`: This means that either the token is invalid or no longer in use. Ensure that the
  correct current version of the token is pasted in the `token` file in `secrets`. Without any spaces as that will be
  considered as altering the token.
- `Token file not found`: This means that the `token` file could simply not be found. So just create the `token` file
  with the bot token in the `secrets` directory.
- `Module not found: x, y, z`: It means that one of the modules that the bot uses was not installed. The default
  libraries and modules used can be found in the requirements.txt file however if you have 3rd party extensions added
  you may want to check them to see if their modules has not been installed. Just install them manually or modify the
  requirements.txt to have pip do it for you. (You will have to call pip manually if you do not use docker.)
- `Python syntax error`: This is most likely because you have multiple different versions of python installed, and it is
  selecting the lowest numbered version which may not have the correct syntax used. To ensure you are using the correct
  version simply get the version number and add it to the end of the python call. E.g. python3.9 will force run with
  python version 3.9. This may also be needed to be done for pip install as well.
- `extension_config.json not found`: This is an ignorable error. The extension module allows for different Cogs to load
  Cog specific configs and overwrites to those settings are inside this file. If the file is not there and the extension
  is written with this in mind the bot will run without further issues. If an issue does occur, and you have confirmed
  that it is cause of this file not loaded contact the extension developer and report the issue.
- `An exception has occurd and I dont know what to do`: Okay calm down. Simply get the full exception traceback and file
  an issue. Remember to include what you were doing at the time as in some cases context is needed. Otherwise, there is
  nothing to be worried about. Unless a major issue occurs the bot should remain functional.

[Back to top](#lastwhisper-discord-bot)

## I want to develop my own Extension to use, What do I do?.

Set up the bot as per the steps provided with the notable exception of performing a manual installation. Afterwards, set
up a standard python development environment in the directory, making sure to make the folder bot as the source
directory, and begin creating the extension as per the normal discord py api (I tried to not create my own framework
fully for easy of use sakes).

The extension file should be placed in extensions unless you changed it in the extension_configs.json file.

You can look through the source code of the preexisting extensions to get a better understanding of how they work as
well as a guide to using any cross extension feature they may provide.

Also read through the documentation for the [discord.py](https://discordpy.readthedocs.io/en/stable/index.html)
libraries. At this point you should be all set and more or less all on your own.

[Back to top](#lastwhisper-discord-bot)
