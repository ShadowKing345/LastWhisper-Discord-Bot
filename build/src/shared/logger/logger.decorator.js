import { injectWithTransform } from "tsyringe";
import { LoggerFactory } from "./logger.js";
import { LoggerFactoryTransformer } from "./loggerFactory.transformer.js";
export function createLogger(name) {
    return injectWithTransform(LoggerFactory, LoggerFactoryTransformer, name);
}
//# sourceMappingURL=logger.decorator.js.map