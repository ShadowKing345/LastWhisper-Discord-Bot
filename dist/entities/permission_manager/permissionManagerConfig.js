import { __decorate, __metadata } from "tslib";
import { Permission } from "./permission.js";
import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { GuildConfigBase } from "../guildConfigBase.js";
let PermissionManagerConfig = class PermissionManagerConfig extends GuildConfigBase {
    id;
    permissions;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], PermissionManagerConfig.prototype, "id", void 0);
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