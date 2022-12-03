import { Plot } from "./plot.js";
import { BaseEntity } from "typeorm";

/**
 * Gardening module configuration object.
 */
export class GardeningModuleConfig extends BaseEntity {
  public id;
  public guildId: string = null;
  public plots: Plot[] = [];
  public messagePostingChannelId: string = null;
}
