import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Plot } from "./plot.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";

/**
 * Gardening module configuration object.
 */
export class GardeningModuleConfig
  extends ToJsonBase<GardeningModuleConfig>
  implements IEntity<string>
{
  public _id;
  public guildId: string = null;
  public plots: Plot[] = [];
  public messagePostingChannelId: string = null;
}
