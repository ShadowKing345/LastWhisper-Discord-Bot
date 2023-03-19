# Index, Commander & The Entry Point

When one wishes to access the various features of the application including major and minor components we need an entry
point. This one should run the application's starting point followed by a list of options and sub commands to allow the
application to set up the environment for what they need.

This is the role of the [`index.ts`](src/index.ts) file found at the root of the [`src`](src) folder. This file acts as
a script processing the arguments passed to the application using
the [`commander.js`](https://github.com/tj/commander.js/) library, although there is a class written for readability
reasons.

The index file currently can run 3 components; `deploy`, `manageCommand`, and `seedDatabase`. The way the commands are
registered to commander have been abstracted a bit to be using decorators. This makes the presentation a bit easier to
follow and ensures that command only fire when needed as they have been abstracted into a class and methods.

When the index is created the parse command will execute the processing of arguments by commander.

The specifics of what each command does is not too important to be discussed here, but they will execute the following
components:

- [`deploy`](docs/Application%20Structure/Bot%20Application.md)
- [`manageCommand`](docs/Application%20Structure/Slash%20Command%20Manager.md)
- [`seedDatabase`](docs/Application%20Structure/Seeding%20the%20Database.md)