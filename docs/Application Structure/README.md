# Application Structure

The application is relatively complex and can be currently broken down into 2 major components and a bunch of smaller
but still important mini components.

They are not separate services as they do not run independently as separate application and may depend on each other,
but they are not tightly coupled enough to be considered one unit.

The major components are as follows:

- [Bot Application](docs/Application%20Structure/Bot%20Application.md)
- [Slash Command Manager](docs/Application%20Structure/Slash%20Command%20Manager.md)

Some minor components that help around are the following:

- [Index, Commander & The Entry Point](docs/Application%20Structure/Index%20&%20Commander.md)