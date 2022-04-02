# Last Whisper Discord Bot

The Discord bot for the Final Fantasy XIV Last Whisper free company Discord server. 

## Table of contents:

- [Features of the Discord bot](#features-of-the-discord-bot)
- [Prerequisites](#prerequisites)

## Features of the Discord bot:

- Periodically post a message about the buff for the day.

- Event scheduling and posting of reminders by parsing messages.

- Role manager.

## Prerequisites:

- Node.js version 16 or 17 is currently supported and known to work

- Yarn was the used package manager. *npm is also fine.*

### Docker:

A standard docker installer and docker-compose (version 3.5 was used during development) should be fine for running the application with docker.

### Installing prerequisite:

Install the Node.js packages needed to run the application for a production run.

Yarn:

```shell
yarn --production
```

Npm:

```shell
npm install --production
```

## Running:

Once you have cloned and downloaded the prerequisites you can run the following:

Yarn:

```shell
yarn run start
```

or npm:

```shell
npm run start
```

### Registering commands:

To register command you will need to run the `command-setup` script.

### Docker method:

A docker-compose.yml file can be found at the base of the project. You can use docker-compose to build a docker container that can be ran from.

*Note:* You do not need to install prerequisites for this method as the docker container will automatically install them for you.

```shell
docker-compose up --build
```

*Note:* --build will cause the container to rebuild itself from any stage where a change was detected. If you do not want this functionality you can simply remove it.

If you want to detach the instance add a -d right after up.

```shell
docker-compose up -d --build
```

## Building:

In case you need to build the application you can do the following.

### Installing prerequisite:

Install the Node.js packages needed to run the application including development dependencies.

Yarn:

```shell
yarn
```

Npm:

```shell
npm install
```

### Running the build script:

From here you can simply run the `build` script needed. 

Yarn:

```shell
yarn run build
```

Npm:

```shell
npm run build
```

If you wish you can also run the `test` script to ensure everything is working as expected. This can be done before the build as the source code will get tested not the final build.

Yarn:

```shell
yarn run test
```

Npm:

```shell
npm run test
```

## Development:

If you wish to develop the application further you do not need to build the application.

Additionally you will need to use the dev scripts instead of the standard ones.

| Script           | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| dev              | Nodemon watch for the typescript source code.              |
| command-setup:ts | The typescript version of the command registration script. |
