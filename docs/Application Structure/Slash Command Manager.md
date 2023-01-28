# Slash Command Manager

The Slash command management is a one time action that can occur at any given point even when the main application is
running.

It is written as a sudo script file called [`slashCommandManager.ts`](src/slashCommandManager.ts) with the
function `manageCommands` being the actual invokable command to be used. It's a sudo script as it technically cannot be
run by itself and must have the function invoked due to a limitation of javascript importing system.
