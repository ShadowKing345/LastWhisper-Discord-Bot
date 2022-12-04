import { GardeningModuleConfig } from "./gardeningModuleConfig.js";
import { Plot } from "./plot.js";
import { Slot } from "./slot.js";

export * from "./gardeningModuleConfig.js";
export * from "./plot.js";
export * from "./reason.js";
export * from "./reservation.js";
export * from "./slot.js";
export * from "./slotBase.js";

export const GardeningManagerEntities = [GardeningModuleConfig, Plot, Slot];
