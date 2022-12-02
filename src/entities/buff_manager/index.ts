import { BuffManagerConfig } from "./buffManagerConfig.js";
import { Week } from "./week.js";
import { Buff } from "./buff.js";
import { Days } from "./days.js";
import { MessageSettings } from "./messageSettings.js";
import { MixedList } from "typeorm/common/MixedList.js";
import { EntitySchema } from "typeorm/entity-schema/EntitySchema.js";

export * from "./buffManagerConfig.js";
export * from "./week.js";
export * from "./buff.js";
export * from "./days.js";
export * from "./messageSettings.js";
export * from "./weekDTO.js";
export * from "./weekDays.js";

// eslint-disable-next-line @typescript-eslint/ban-types
export const BuffManagerEntities: MixedList<Function | string | EntitySchema> = [BuffManagerConfig, Week, Buff, Days, MessageSettings];
