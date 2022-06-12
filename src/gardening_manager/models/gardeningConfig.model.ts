import { BasicModel } from "../../shared/models/basicModel.js";
import { Plot } from "./plot.model.js";

export class GardeningConfig extends BasicModel {
    public guildId: string;
    public plots: Plot[] = [];
    public messagePostingChannelId: string;
}
