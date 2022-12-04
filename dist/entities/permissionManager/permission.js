import { __decorate, __metadata } from "tslib";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { PermissionManagerConfig } from "./permissionManagerConfig.js";
export var PermissionMode;
(function (PermissionMode) {
    PermissionMode[PermissionMode["ANY"] = 0] = "ANY";
    PermissionMode[PermissionMode["STRICT"] = 1] = "STRICT";
})(PermissionMode || (PermissionMode = {}));
let Permission = class Permission extends BaseEntity {
    id;
    key;
    roles = [];
    mode;
    blackList = false;
    guildConfig;
    get modeEnum() {
        return PermissionMode[this.mode];
    }
    fetchRoleNames(guild) {
        return this.roles.map(roleId => guild?.roles.fetch(roleId).then(role => role?.name));
    }
    async formatRoles(guild) {
        return this.roles.length > 0
            ? (await Promise.allSettled(this.fetchRoleNames(guild))).join("\n")
            : "No roles were set.";
    }
    merge(obj) {
        if (obj.blackList) {
            this.blackList = obj.blackList;
        }
        if (obj.mode) {
            this.mode = obj.mode;
        }
        if (obj.roles) {
            this.roles = obj.roles;
        }
        return this;
    }
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Permission.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Permission.prototype, "key", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], Permission.prototype, "roles", void 0);
__decorate([
    Column({ type: "enum", enum: PermissionMode, default: PermissionMode.ANY }),
    __metadata("design:type", Number)
], Permission.prototype, "mode", void 0);
__decorate([
    Column({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Permission.prototype, "blackList", void 0);
__decorate([
    ManyToOne(() => PermissionManagerConfig, config => config.permissions),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], Permission.prototype, "guildConfig", void 0);
Permission = __decorate([
    Entity()
], Permission);
export { Permission };
//# sourceMappingURL=permission.js.map