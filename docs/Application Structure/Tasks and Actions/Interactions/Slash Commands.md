# Slash Commands

Slash commands are the text chat method of invoking a command.

They have to be registered in order to appear and can only exist inside a guild text channel. You cannot invoke them in
a direct message channel.

Due to them needing to be registered more information needs to be provided in order to have one appear during the slash
command registration script.

The most basic slash command has the following:

| Variable Name | Description                                                                                                                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name          | The name of the slash command. The name has to be unique between all commands and cannot have any spaces, capital, or special letters. Underscores can be used.                                                 |
| description   | The description of the command. This should provide some idea of what the command does. There is a limit to how long this can be.                                                                               |
| execute       | The callback function called when the slash command needs to be invoked.<br/>The only thing provided as an argument to this callback is the `ChatInputCommandInteraction` object created upon event invocation. |

For a more advanced slash command the following can be provided.

| Variable Name | Description                                                                                                                                                                                                                                                                                                                         |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| subcommands   | These are additional subcommands that can be invoked instead of the main command.<br/>It's it like a child command.<br/>You are limited to two generations deeps. `help me now` can be registered but not `help me now please`.<br/>*Note: Subcommands do not have their own execute instead the root parent subcommand is called.* |
| options       | Options are the parameters a slash command can have.<br/>*Note: You cannot have a option and a subcommand at the same time. Subcommands can have but not the parent command.*                                                                                                                                                       |
