import { Plot } from "./plot.js";
import { BaseEntity } from "typeorm";
export declare class GardeningModuleConfig extends BaseEntity {
    id: any;
    guildId: string;
    plots: Plot[];
    messagePostingChannelId: string;
}
//# sourceMappingURL=gardeningConfig.d.ts.map