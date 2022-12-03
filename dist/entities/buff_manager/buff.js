import { __decorate, __metadata } from "tslib";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
let Buff = class Buff {
    id;
    text = null;
    imageUrl = null;
    guildConfig;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Buff.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Buff.prototype, "text", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Buff.prototype, "imageUrl", void 0);
__decorate([
    ManyToOne(() => BuffManagerConfig, config => config.buffs),
    JoinTable({ name: "guild_config_id" }),
    __metadata("design:type", Object)
], Buff.prototype, "guildConfig", void 0);
Buff = __decorate([
    Entity()
], Buff);
export { Buff };
//# sourceMappingURL=buff.js.map