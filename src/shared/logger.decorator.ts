import { injectWithTransform } from "tsyringe";

import { LoggerFactory, LoggerFactoryTransformer } from "./logger.js";

export function createLogger(name: string) {
    return injectWithTransform(LoggerFactory, LoggerFactoryTransformer, name);
}