import { SlashCommandBuilder } from "@discordjs/builders";
export class Command {
}
export function BuildCommand(command) {
    if (!command.command) {
        return null;
    }
    if (command.command instanceof SlashCommandBuilder) {
        return command.command;
    }
    else if (typeof command.command === "function") {
        return (command.command(new SlashCommandBuilder()));
    }
}
//# sourceMappingURL=command.js.map