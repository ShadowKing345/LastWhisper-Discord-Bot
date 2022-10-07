/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export class PermissionKeysType extends ToJsonBase<PermissionKeysType> {
    public name: string;
    public description: string;

    public subcommands?: { [key: string]: Partial<PermissionKeysType> };

    public constructor(data: Partial<PermissionKeysType>) {
        super();
        this.merge(data as PermissionKeysType);
    }

    public build(): SlashCommandBuilder {
        return new SlashCommandBuilder();
    }
}