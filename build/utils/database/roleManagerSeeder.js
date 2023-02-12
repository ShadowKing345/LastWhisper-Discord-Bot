import { isArray, isObject } from "../index.js";
import { RoleManagerConfig } from "../../entities/roleManager.js";
export async function roleManagerSeeder(ds, guildId, data) {
    if (isObject(data)) {
        const roleManagerConfig = new RoleManagerConfig();
        roleManagerConfig.guildId = guildId;
        if ("acceptedRoleId" in data && typeof data.acceptedRoleId === "string") {
            roleManagerConfig.acceptedRoleId = data.acceptedRoleId;
        }
        if ("reactionMessageIds" in data && isArray(data.reactionMessageIds)) {
            roleManagerConfig.reactionMessageIds = data.reactionMessageIds.filter(value => typeof value === "string");
        }
        if ("reactionListeningChannel" in data && typeof data.reactionListeningChannel === "string") {
            roleManagerConfig.reactionListeningChannel = data.reactionListeningChannel;
        }
        await ds.getRepository(RoleManagerConfig).save(roleManagerConfig);
    }
}
//# sourceMappingURL=roleManagerSeeder.js.map