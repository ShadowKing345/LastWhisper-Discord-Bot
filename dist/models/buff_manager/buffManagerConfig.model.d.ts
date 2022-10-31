import { Buff } from "./buff.model.js";
import { MessageSettings } from "./messageSettings.model.js";
import { Week } from "./week.model.js";
import { IEntity } from "../../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class BuffManagerConfig extends ToJsonBase<BuffManagerConfig> implements IEntity<string> {
    _id: string;
    guildId: string;
    messageSettings: MessageSettings;
    buffs: Buff[];
    weeks: Week[];
    merge(obj: BuffManagerConfig): BuffManagerConfig;
}
//# sourceMappingURL=buffManagerConfig.model.d.ts.map