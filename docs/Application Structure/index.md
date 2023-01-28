# Application Structure

## Entry points

At the moment the application handles two basic tasks. The first is the processing of Discord events and timers. The
second is registration or un-registration of slash commands to Discord.

The [`index.ts`](src/index.ts), found at the root of the project `src` directory counts as script that can be used to
run the various functions needed for the application to run correctly.
Currently, you can only start the main application or manage the slash commands.

The file uses commander as a npm module to manage the arguments and subcommands passed to the script.
Additionally, this script manages registering additional configuration files into the dependency injection system.
Finally, the script file contains the import reflect metadata.

Further information about the entry points can be found at:

- [Slash Command Manager](docs/Application%20Structure/Slash%20Command%20Manager.md)
- [Bot Application](docs/Application%20Structure/Bot%20Application.md)
