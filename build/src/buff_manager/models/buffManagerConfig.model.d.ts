import { BasicModel } from "../../shared/models/basicModel.js";
import { Buff } from "./buff.model.js";
import { MessageSettings } from "./messageSettings.model.js";
import { Week } from "./week.model.js";
export declare class BuffManagerConfig extends BasicModel {
    guildId: string;
    messageSettings: MessageSettings;
    buffs: Buff[];
    weeks: Week[];
}
//# sourceMappingURL=buffManagerConfig.model.d.ts.map