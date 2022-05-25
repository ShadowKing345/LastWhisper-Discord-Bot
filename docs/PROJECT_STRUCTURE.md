# Project Structure
The LastWhisper free company from the game Final Fantasy XIV has requested the creation of a private Discord bot to be used within their private Discord server.

The bot will be primarily used for managing the server and simplifying common tasks such as posting reminders.
Additionally, the bot will provide common missing features such as on leave / kick / ban messages and clear channel commands.

Within this document will contain the structure of the project to be used within the development and deployment of the application.
Furthermore, additional information such as data-time format, logging message structure and color usage.

## Project Requirements
The project will require the following components in order to function as intended.

+ Buff Manager: This component manages the posting of daily messages that define the buff for the day. Additionally, it posts a weekly message.
+ Event Manager: This component manages event (defined later on) as well as reminders about the event.
+ Gardening Manager: This component tries to manager the state of the garden outside the FC house.
+ Party Finder: This component attempts to mimic the party finder functionality but with the event system as well.
+ Role Manager: This component manages roles for the user.
+ Manager Utils Manager: This component deals with the various manager features that are missing.
+ Logger: This component ensures that information from the bot is correctly output to the standard output for the console or a log file if needed later on.

## Structure
The project will be written in Typescript, a super set of Javascript. The main reason shall be to provide type safeguards when dealing with the more sensitive data structures.
Eslint shall be used as the linting tool to synchronize the appearance of code between developers as much as possible.
Node tap shall be the testing library used as the resulting code files can be run with standard Node and no special cli.
The project will split into four main components. 

### Discord Client
The bot client which handles communication with the Discord's servers.
This will provide the events needed to interact with the Discord server such as slash command interaction events, reaction events, etc.
This will be provided by the Discord.js api. 

### Modules
Modules are what process the information provided by the client. 
You can think of them as controllers in a standard web API project. They take in web requests and provide necessary output based on certain processing.

Each module will have its own way of handling slash commands but a general structure for how they are written is provided.
For abstraction reasons the module will not process the information directly instead it will perform simple transformations and pass the information to the services.

Each component described in the requirements will be a module except the Logger which will be a global object that any of the various parts can call upon.

### Service
A service processes the information into its final form. Each service will separate to the module and multiple services can be used in the same module.

### Repository
The repository is the component that manages saving and finding of information to the database.
It should be abstract enough to allow for use of multiple different types of databases.

### Inject-ability
The project shall use dependency injection to simplify the use of these different components.
A third party library will be used to simplify this.

## Logger
The logger handles how information is presented to the command line or saved into a file. Currently, the project is
using Winston as its logger as the default JavaScript is not ideal for complex logging.

The format for the logger is as follows.

```
<Time stamp (YYYY-MM-DD hh:mm:ss)> <context> [<Logger leve>]: <message>
```

The context should be used to denote where the log is coming from. For example, if the context is a repository it should
read as `<RepositoryName>Repository` when logged.

### Colors
Colors are used to denote what type of information is being presented and the context. If the information is a simple
generic message then the color will be left as default to the terminal or log out put used. The color meanings are as
follows.

For the logger level:

| Color  | Meaning or usage |
|--------|------------------|
| Red    | Errors           |
| Yellow | Warnings         |
| Cyan   | Information      |
| Blue   | Debug            |

For the logger message:

| Color          | Meaning or Usage                                                                          |
|----------------|-------------------------------------------------------------------------------------------|
| Bright Blue    | Modules, Services, or Repositories.                                                       |
| Blue           | Models or Class objects.                                                                  |
| Bright Yellow  | Context color.                                                                            |
| Yellow         | Information provided by the client. Eg, guildId, clientId, messageID.                     |
| Bright Magenta | Bot event specific actions. Eg, ready message, interaction invocation, on error messages. |
| Cyan           | Actions executed internally. Setup of commands for example.                               |
| Green          | Successfully execution or initialization. Think of it as something good has happened.     |
| Red            | Failure of execution or initialization. Think of it as something bad has happened.        |

In case of too many logger calls preventing your for seeing the information in the terminal property, you can use a
background color such as bgRed. This however should only be used for at the time debugging information and should not be
left in. Any color can be used as these logger calls are temporary.

### Special Message Formatting
Formatting the text of a message to be bold, underlined, strike through, or any combination is allowed for emphasis of
the meaning of the message and does not have restrictions other than to follow proper grammar rules.

UwU, OwO, pirate or sarcastic speech should not be used other than as an April Fools' joke in the Debugging level of the
logger (You can use it in the comments of your code tho uwu). 