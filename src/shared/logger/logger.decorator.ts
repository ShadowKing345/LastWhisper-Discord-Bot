import { injectWithTransform } from "tsyringe";

import { LoggerFactory } from "./logger.js";
import { LoggerFactoryTransformer } from "./loggerFactory.transformer.js";

export function createLogger(name: string) {
    return injectWithTransform(LoggerFactory, LoggerFactoryTransformer, name);
}