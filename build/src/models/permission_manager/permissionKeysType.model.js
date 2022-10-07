/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
export class PermissionKeysType extends ToJsonBase {
    name;
    description;
    subcommands;
    constructor(data) {
        super();
        this.merge(data);
    }
    build() {
        return new SlashCommandBuilder();
    }
}
//# sourceMappingURL=permissionKeysType.model.js.map