/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
export declare class PermissionKeysType extends ToJsonBase<PermissionKeysType> {
    name: string;
    description: string;
    subcommands?: {
        [key: string]: Partial<PermissionKeysType>;
    };
    constructor(data: Partial<PermissionKeysType>);
    build(): SlashCommandBuilder;
}
//# sourceMappingURL=permissionKeysType.model.d.ts.map