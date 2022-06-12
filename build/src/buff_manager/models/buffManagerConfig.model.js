import { BasicModel } from "../../shared/models/basicModel.js";
import { MessageSettings } from "./messageSettings.model.js";
export class BuffManagerConfig extends BasicModel {
    guildId;
    messageSettings = new MessageSettings();
    buffs = [];
    weeks = [];
}
//# sourceMappingURL=buffManagerConfig.model.js.map