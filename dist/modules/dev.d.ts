import { Module } from "./module.js";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import { Logger } from "../config/logger.js";
export declare class DevModule extends Module {
    protected logger: Logger;
    static moduleName: string;
    constructor();
    subcommandResolverTest(interaction: ChatInputCommandInteraction): Promise<unknown>;
    testChatInteractionFunction(interaction: ChatInputCommandInteraction): Promise<unknown>;
    testInteractionTypes(interaction: CommandInteraction): Promise<unknown>;
    testModal(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
//# sourceMappingURL=dev.d.ts.map