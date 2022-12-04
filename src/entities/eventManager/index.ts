import { EventManagerConfig } from "./eventManagerConfig.js";
import { EventObj } from "./eventObj.js";
import { Reminder } from "./reminder.js";
import { Tags } from "./tags.js";

export * from "./eventManagerConfig.js";
export * from "./eventObj.js";
export * from "./reminder.js";
export * from "./tags.js";

export const EventManagerEntities = [EventManagerConfig, EventObj, Reminder, Tags];
