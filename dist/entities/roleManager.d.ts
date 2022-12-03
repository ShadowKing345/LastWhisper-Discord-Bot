import { BaseEntity } from "typeorm";
export declare class RoleManagerConfig extends BaseEntity {
    id: string;
    guildId: string;
    acceptedRoleId: string;
    reactionMessageIds: string[];
    reactionListeningChannel: string;
}
//# sourceMappingURL=roleManager.d.ts.map