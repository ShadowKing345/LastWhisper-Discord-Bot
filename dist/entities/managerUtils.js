import { BaseEntity } from "typeorm";
export class ManagerUtilsConfig extends BaseEntity {
    id;
    guildId = null;
    loggingChannel = null;
    clearChannelBlacklist = [];
}
//# sourceMappingURL=managerUtils.js.map