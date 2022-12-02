import { Relation } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";
export declare class Buff {
    id: string;
    text: string;
    imageUrl: string;
    guildConfig: Relation<BuffManagerConfig>;
}
//# sourceMappingURL=buff.d.ts.map