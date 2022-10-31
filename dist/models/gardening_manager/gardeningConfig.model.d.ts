import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Plot } from "./plot.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class GardeningModuleConfig extends ToJsonBase<GardeningModuleConfig> implements IEntity<string> {
    _id: any;
    guildId: string;
    plots: Plot[];
    messagePostingChannelId: string;
}
//# sourceMappingURL=gardeningConfig.model.d.ts.map