import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Plot } from "./plot.model.js";

/**
 * Gardening module configuration object.
 */
export class GardeningModuleConfig implements IEntity {
    public _id;
    public guildId: string;
    public plots: Plot[] = [];
    public messagePostingChannelId: string;
}
