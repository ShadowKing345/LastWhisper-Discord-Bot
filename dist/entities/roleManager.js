import { BaseEntity } from "typeorm";
export class RoleManagerConfig extends BaseEntity {
    id;
    guildId = null;
    acceptedRoleId = null;
    reactionMessageIds = [];
    reactionListeningChannel = null;
}
//# sourceMappingURL=roleManager.js.map