import { BasicModel } from "../../utils/models/index.js";
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