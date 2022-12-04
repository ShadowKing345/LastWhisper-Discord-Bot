import { Slot } from "./slot.js";
import { GardeningModuleConfig } from "./gardeningModuleConfig.js";
import { BaseEntity, Relation } from "typeorm";
export declare class Plot extends BaseEntity {
    id: string;
    name: string;
    description: string;
    slots: Slot[];
    guildConfig: Relation<GardeningModuleConfig>;
}
//# sourceMappingURL=plot.d.ts.map