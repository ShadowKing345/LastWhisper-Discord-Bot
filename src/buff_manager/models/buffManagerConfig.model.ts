import { BasicModel } from "../../shared/models/basicModel.js";
import { Buff } from "./buff.model.js";
import { MessageSettings } from "./messageSettings.model.js";
import { Week } from "./week.model.js";

export class BuffManagerConfig extends BasicModel {
    public guildId: string;
    public messageSettings: MessageSettings = new MessageSettings();
    public buffs: Buff[] = [];
    public weeks: Week[] = [];
}
