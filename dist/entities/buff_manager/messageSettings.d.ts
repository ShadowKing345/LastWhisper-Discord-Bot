import { Relation } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
export declare class MessageSettings {
    id: string;
    channelId: string;
    hour: string;
    dow: number;
    buffMessage: string;
    weekMessage: string;
    guildConfig: Relation<BuffManagerConfig>;
}
//# sourceMappingURL=messageSettings.d.ts.map