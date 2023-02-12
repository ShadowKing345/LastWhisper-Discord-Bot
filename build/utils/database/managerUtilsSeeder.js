import { isArray, isObject } from "../index.js";
import { ManagerUtilsConfig } from "../../entities/managerUtils.js";
export async function managerUtilsSeeder(ds, guildId, data) {
    if (isObject(data)) {
        const managerUtils = new ManagerUtilsConfig();
        managerUtils.guildId = guildId;
        if ("loggingChannel" in data && typeof data.loggingChannel === "string") {
            managerUtils.loggingChannel = data.loggingChannel;
        }
        if ("clearChannelBlacklist" in data && isArray(data.clearChannelBlacklist)) {
            managerUtils.clearChannelBlacklist = data.clearChannelBlacklist.filter(value => typeof value === "string");
        }
        await ds.getRepository(ManagerUtilsConfig).save(managerUtils);
    }
}
//# sourceMappingURL=managerUtilsSeeder.js.map