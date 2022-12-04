import { __decorate, __metadata } from "tslib";
import { Permission } from "./permission.js";
import { Entity, OneToMany } from "typeorm";
import { EntityBase } from "../entityBase.js";
let PermissionManagerConfig = class PermissionManagerConfig extends EntityBase {
    permissions;
};
__decorate([
    OneToMany(() => Permission, permission => permission.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], PermissionManagerConfig.prototype, "permissions", void 0);
PermissionManagerConfig = __decorate([
    Entity()
], PermissionManagerConfig);
export { PermissionManagerConfig };
//# sourceMappingURL=permissionManagerConfig.js.map