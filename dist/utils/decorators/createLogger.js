import { injectWithTransform } from "tsyringe";
import { LoggerService, LoggerFactoryTransformer } from "../../services/loggerService.js";
export function createLogger(context) {
    return injectWithTransform(LoggerService, LoggerFactoryTransformer, context);
}
//# sourceMappingURL=createLogger.js.map