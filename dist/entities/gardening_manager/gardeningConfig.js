import { BaseEntity } from "typeorm";
export class GardeningModuleConfig extends BaseEntity {
    id;
    guildId = null;
    plots = [];
    messagePostingChannelId = null;
}
//# sourceMappingURL=gardeningConfig.js.map