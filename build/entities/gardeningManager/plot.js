import { __decorate, __metadata } from "tslib";
import { GardeningModuleConfig } from "./gardeningModuleConfig.js";
import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm";
let Plot = class Plot extends BaseEntity {
    id;
    name = null;
    description = null;
    slots;
    guildConfig;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Plot.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Plot.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Plot.prototype, "description", void 0);
__decorate([
    ManyToOne(() => GardeningModuleConfig, config => config.plots),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], Plot.prototype, "guildConfig", void 0);
Plot = __decorate([
    Entity()
], Plot);
export { Plot };
//# sourceMappingURL=plot.js.map