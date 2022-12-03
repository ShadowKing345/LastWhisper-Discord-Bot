import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { GuildConfigBase } from "./guildConfigBase.js";
let ManagerUtilsConfig = class ManagerUtilsConfig extends GuildConfigBase {
    id;
    loggingChannel = null;
    clearChannelBlacklist;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], ManagerUtilsConfig.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], ManagerUtilsConfig.prototype, "loggingChannel", void 0);
__decorate([
    Column("text", { array: true }),
    __metadata("design:type", Array)
], ManagerUtilsConfig.prototype, "clearChannelBlacklist", void 0);
ManagerUtilsConfig = __decorate([
    Entity()
], ManagerUtilsConfig);
export { ManagerUtilsConfig };
//# sourceMappingURL=managerUtils.js.map