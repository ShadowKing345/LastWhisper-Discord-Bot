import { BasicModel } from "../../utils/models/index.js";
import { Plot } from "./plot.model.js";

export class GardeningConfig extends BasicModel {
    public guildId: string;
    public plots: Plot[] = [];
    public messagePostingChannelId: string;
}
