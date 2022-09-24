import { Buff } from "./buff.model.js";
import { MessageSettings } from "./messageSettings.model.js";
import { Week } from "./week.model.js";
import { IEntity } from "../../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";

/**
 * Buff Manager Configuration Object.
 */
export class BuffManagerConfig extends ToJsonBase<BuffManagerConfig> implements IEntity {
    public _id;
    public guildId: string;
    public messageSettings: MessageSettings = new MessageSettings();
    public buffs: Buff[] = [];
    public weeks: Week[] = [];

    public sanitizeObject(newObj: BuffManagerConfig): BuffManagerConfig {
        super.sanitizeObject(newObj);

        this.messageSettings = deepMerge(new MessageSettings, this.messageSettings);
        this.buffs = this.buffs.map(buff => deepMerge(new Buff, buff));
        this.weeks = this.weeks.map(week => deepMerge(new Week, week));

        return this;
    }
}
