import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Plot } from "./plot.model.js";
/**
 * Gardening module configuration object.
 */
export declare class GardeningModuleConfig implements IEntity {
    _id: any;
    guildId: string;
    plots: Plot[];
    messagePostingChannelId: string;
}
//# sourceMappingURL=gardeningConfig.model.d.ts.map