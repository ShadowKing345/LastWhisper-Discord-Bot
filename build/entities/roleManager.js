import { __decorate, __metadata } from "tslib";
import { Entity, Column } from "typeorm";
import { EntityBase } from "./entityBase.js";
let RoleManagerConfig = class RoleManagerConfig extends EntityBase {
    acceptedRoleId = null;
    reactionMessageIds;
    reactionListeningChannel = null;
};
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