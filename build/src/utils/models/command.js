import { SlashCommandBuilder } from "@discordjs/builders";
export class Command {
    command;
    run;
}
export function BuildCommand(command) {
    return command.command(new SlashCommandBuilder());
}
//# sourceMappingURL=command.js.map