import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { GuildConfigBase } from "./guildConfigBase.js";
let RoleManagerConfig = class RoleManagerConfig extends GuildConfigBase {
    id;
    acceptedRoleId = null;
    reactionMessageIds;
    reactionListeningChannel = null;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], RoleManagerConfig.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], RoleManagerConfig.prototype, "acceptedRoleId", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], RoleManagerConfig.prototype, "reactionMessageIds", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], RoleManagerConfig.prototype, "reactionListeningChannel", void 0);
RoleManagerConfig = __decorate([
    Entity()
], RoleManagerConfig);
export { RoleManagerConfig };
//# sourceMappingURL=roleManager.js.map