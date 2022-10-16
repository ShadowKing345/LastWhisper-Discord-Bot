/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder } from "discord.js";
import { deepMerge } from "../../utils/index.js";
export class PermissionKeysType extends ToJsonBase {
    name;
    description;
    subcommands;
    constructor(data = null) {
        super();
        if (data) {
            this.merge(data);
        }
    }
    merge(obj) {
        if (obj.name) {
            this.name = obj.name;
        }
        if (obj.description) {
            this.description = obj.description;
        }
        if (obj.subcommands) {
            if (!this.subcommands) {
                this.subcommands = {};
            }
            for (const key in obj.subcommands) {
                this.subcommands[key] = deepMerge(this.subcommands[key] ?? new PermissionKeysType(), obj.subcommands[key]);
            }
        }
        return this;
    }
    build(builder = new SlashCommandBuilder()) {
        builder.setName(this.name).setDescription(this.description);
        if (this.subcommands) {
            for (const subcommand of Object.values(this.subcommands)) {
                if (Object.values(subcommand.subcommands ?? []).length > 0 && builder instanceof SlashCommandBuilder) {
                    builder.addSubcommandGroup(subcommandGroupBuilder => subcommand.build(subcommandGroupBuilder));
                }
                else if (!(builder instanceof SlashCommandSubcommandBuilder)) {
                    builder.addSubcommand(subcommandBuilder => subcommand.build(subcommandBuilder));
                }
            }
        }
        return builder;
    }
}
//# sourceMappingURL=permissionKeysType.model.js.map