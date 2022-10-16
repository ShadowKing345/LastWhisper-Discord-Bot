/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
declare type SlashCommand = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
export declare class PermissionKeysType extends ToJsonBase<PermissionKeysType> {
    name: string;
    description: string;
    subcommands?: {
        [key: string]: Partial<PermissionKeysType>;
    };
    constructor(data?: Partial<PermissionKeysType>);
    merge(obj: PermissionKeysType): PermissionKeysType;
    build(builder?: SlashCommand): SlashCommand;
}
export {};
//# sourceMappingURL=permissionKeysType.model.d.ts.map