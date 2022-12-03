import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
let MessageSettings = class MessageSettings {
    id;
    channelId = null;
    hour = null;
    dow = null;
    buffMessage = null;
    weekMessage = null;
    guildConfig;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], MessageSettings.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "channelId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "hour", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], MessageSettings.prototype, "dow", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "buffMessage", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MessageSettings.prototype, "weekMessage", void 0);
__decorate([
    OneToOne(() => BuffManagerConfig, config => config.messageSettings),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], MessageSettings.prototype, "guildConfig", void 0);
MessageSettings = __decorate([
    Entity()
], MessageSettings);
export { MessageSettings };
//# sourceMappingURL=messageSettings.js.map