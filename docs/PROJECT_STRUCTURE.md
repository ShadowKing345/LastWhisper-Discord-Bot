# Project Structure

The LastWhisper free company from the game Final Fantasy XIV has requested the creation of a private Discord bot to be
used within their private Discord server.

The bot will be primarily used for managing the server and simplifying common tasks such as posting reminders.
Additionally, the bot will provide common missing features such as on leave / kick / ban messages and clear channel
commands.

Within this document will contain the structure of the project to be used within the development and deployment of the
application. Furthermore, additional information such as data-time format, logging message structure and color usage.

## Project Requirements

The project will require the following components in order to function as intended.

+ Buff Manager: This component manages the posting of daily messages that define the buff for the day. Additionally, it
  posts a weekly message.
+ Event Manager: This component manages event (defined later on) as well as reminders about the event.
+ Gardening Manager: This component tries to manager the state of the garden outside the FC house.
+ Party Finder: This component attempts to mimic the party finder functionality but with the event system as well.
+ Role Manager: This component manages roles for the user.
+ Manager Utils Manager: This component deals with the various manager features that are missing.
+ Logger: This component ensures that information from the bot is correctly output to the standard output for the
  console or a log file if needed later on.
+ Permission Manager: This component will manage the ability to execute a command.

## Structure

The project will be written in Typescript, a super set of Javascript. The main reason shall be to provide type
safeguards when dealing with the more sensitive data structures. Eslint shall be used as the linting tool to synchronize
the appearance of code between developers as much as possible. Node tap shall be the testing library used as the
resulting code files can be run with standard Node and no special cli. The project will split into four main components.

### Discord Client

The bot client which handles communication with the Discord's servers. This will provide the events needed to interact
with the Discord server such as slash command interaction events, reaction events, etc. This will be provided by the
Discord.js api.

### Modules

Modules are what process the information provided by the client. You can think of them as controllers in a standard web
API project. They take in web requests and provide necessary output based on certain processing.

Each module will have its own way of handling slash commands but a general structure for how they are written is
provided. For abstraction reasons the module will not process the information directly instead it will perform simple
transformations and pass the information to the services.

Each component described in the requirements will be a module except the Logger which will be a global object that any
of the various parts can call upon.

### Service

A service processes the information into its final form. Each service will separate to the module and multiple services
can be used in the same module.

### Repository

The repository is the component that manages saving and finding of information to the database. It should be abstract
enough to allow for use of multiple different types of databases.

### Inject-ability

The project shall use dependency injection to simplify the use of these different components. A third party library will
be used to simplify this.

## Buff Manager

The buff manager will be responsible for posting daily and weekly messages about what the upcoming buff(s) will be.
There will be two different messages posted. A daily message which contains only the buff for the day, and the weekly
one which should be posted once in a week to mark the buffs for that week. Additionally, the users should be able to
request the daily or weekly message for that day or the next.

The week objects contain the information about what buffs to use as well as the order. The information will be the name
of the week. Weeks have the ability to be skipped by setting a special variable to true. The buff object contains the
information about the buff such as its name, the icon and its affect.

## Event Manager

The event manager deals with parsing and posting reminders of events. The workflow is as follows. Given a channel the
event manager will read all incoming messages and will parse them for event information denoted with tags. If a message
is considered a valid event then it will save that event and react to inform the poster it has accepted it. Once saved
the time when the event will occur will be used to determine when to post reminders. If the user has set a reminder the
bot will post a message before the actual event starts.

Commands for seeing what up and coming events as well as the details on a command should also exist.

The event object will contain the following:

+ Name of the event.
+ Description.
+ Time.
+ Additional tags.

*Note: Additional tags are just a collection of additional information outside the event object. They will be stored in
key value pairs.*

A reminder is as follows:

+ Message to be posted. (Should allow for basic data binding for additional formatting).
+ Time Delta. The amount of time between now and the event when the bot posts the event.

## Gardening Manager

This module will be responsible for managing reservations of the gardening plot in the Free Company garden. The module
has three objects the plot, the slot, and the reservation. The slot will contain the information of who planted, what is
planted, when, for how long, and the reason. Reservations will be what is next in that slot. The plot will contain the
information of the slots, how many, where to find them etc.

This manager will be unique in that it does not respond to the executioner of the command instead it posts a general
message in a channel regarding state changes.

## Party Finder

*WIP*

This module allows for creating events with the ability to register for them in a full party scenario. The unique
message posted will allow a willing participant to react and be assigned a role for that event. If all the roles are
filled they are considered as a substitute instead. A user can react to multiple job types and the message should try
its best to fill as many slots as possible with the given information.

## Role Manager

As the name implies this manager manages the various roles of a user. When the user first joins a role will be assigned
to them, and they can react to change it to a different role.

## Manager Utils Manager

While the name is confusing this manager roles is to provide missing functionality from Discord such as a user left
message and the ability to clear channels.

## Permission Manager.

As it is not possible to restrict the use of sub commands in a slash command, individual permission management will be
used.
They way this manager will handle it is as follows. Given a user, command id, permission configs, the permission manager
will check if the user has any of the roles assigned to the config. If the user has any then the permission manager will
return true else false.

The config file will be a simple key value pair collection with the value being a list of role ids.

The owner of the guild will be allowed to execute any command regardless of roles.

The commands this manager will be using shall be to manage roles. I.e. set roles for a key etc.

The command to get if the user has permission can allow to check if the user is a manager, if any/all roles should be
assigned or if the user can only be an owner.

## Logger

To log information about the application we shall use `pino`. `pino-pretty` shall be used to represent the outputted
JSON in a more human-readable format.

The format for the log messages should be as follows.

```
<Time stamp (yyyy-MM-dd hh:mm:ss)> <context> [<Logger leve>]: <message>
```

The context should be used to denote where the log is coming from. For example, if the context is a repository it should
read as `<RepositoryName>Repository` when logged.

### Colors

Colors will be used to denote what type of information is being presented and the context. If the information is a
simple generic message then the color will be left as default. The color meanings are as follows.

For the logger level:

| Color  | Meaning or usage |
|--------|------------------|
| Red    | Errors           |
| Yellow | Warnings         |
| Cyan   | Information      |
| Blue   | Debug            |
| Pink   | Silly            |

For the logger message:

| Color  | Meaning or Usage          |
|--------|---------------------------|
| Yellow | Any object value          |
| Red    | Classes                   |
| Green  | Events (Skipping, etc...) |

In case of too many logger calls preventing your for seeing the information in the terminal property, you can use a
background color such as bgRed. This however should only be used for at the time debugging information and should not be
left in. Any color can be used as these logger calls are temporary.

### Special Message Formatting

Formatting the text of a message to be bold, underlined, strike through, or any combination is allowed for emphasis of
the meaning of the message and does not have restrictions other than to follow proper grammar rules.

UwU, OwO, pirate or sarcastic speech should not be used other than as an April Fools' joke in the Debugging level of the
logger (You can use it in the comments of your code tho uwu).

## Code Style

Eslint will be used to help with managing consistency with code styles. However, unless specifically specified you do
not need to follow the rules just ensure that the code is visible and easily understandable.

Special Javascript operations such as `condition ? true : false` or `??=` are allowed without issue.

### Naming Conventions

Files are to be named in this format `fileName.componentType.ts`. The name shall be in camelCase and the component type
should define what the file does as best it can. For example a service file will contain services related to that name.

### Class Names

Classes should be named with the class name followed by the type except models. The case format shall be Upper
CamelCase. For example `BuffManagerModule`.

### Function Names

Functions will use the camelCase formatting as well.

### Typescript

When dealing with typescript it's best to provide as much type information as possible. Such as public / private,
various types the object can be ETC. Having a type of `any` if you don't know what the type will be is also acceptable.

## Documentation

As the code is that always complex you do not need to fully document it. But you should ensure the names are logical
sense for the action executed. If a function is complex such as a parsing of text method then you can add comments to
help break it down to more understandable parts.

## Configuration

The bot will use a JSON file to save configuration. The configuration system should be robust enough to allow for a
large amount of configuration to be missing.

An additional tool for creating the file shall be created as well to assist with the creation of the config file.
Finally, a schema file is also provided in the `docs` directory.

In the case of database configuration a push from mongoDB should be started soon as while the database is alright the
document based structure has provided issues in previous major versions of this application.