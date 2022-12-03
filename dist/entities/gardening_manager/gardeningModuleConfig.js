import { __decorate, __metadata } from "tslib";
import { Plot } from "./plot.js";
import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { GuildConfigBase } from "../guildConfigBase.js";
let GardeningModuleConfig = class GardeningModuleConfig extends GuildConfigBase {
    id;
    plots;
    messagePostingChannelId = null;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], GardeningModuleConfig.prototype, "id", void 0);
__decorate([
    OneToMany(() => Plot, plot => plot.guildConfig, {
        cascade: true,
        orphanedRowAction: "delete",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], GardeningModuleConfig.prototype, "plots", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], GardeningModuleConfig.prototype, "messagePostingChannelId", void 0);
GardeningModuleConfig = __decorate([
    Entity()
], GardeningModuleConfig);
export { GardeningModuleConfig };
//# sourceMappingURL=gardeningModuleConfig.js.map