var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { pino } from "pino";
import { singleton, injectWithTransform } from "tsyringe";
import { ProjectConfiguration } from "./models/index.js";
import { LOGGING_LEVELS } from "./models/loggingConfigs.js";
/**
 * Service used to handle logging calls.
 */
let LoggerService = class LoggerService {
    configs;
    pino;
    constructor(appConfigs) {
        this.configs = appConfigs.logging;
        this.pino = pino({
            level: this.configs.level ?? LOGGING_LEVELS.info,
            transport: this.configs.transports ?? null
        });
    }
    /**
     * Todo: Attempt to make this a single instance.
     * Creates an instance of a logger for the requesting class.
     * @param context The context name.
     * @return pino logger object.
     */
    buildLogger(context) {
        this.pino.info("Testing");
        return this.pino.child({ context });
    }
};
LoggerService = __decorate([
    singleton(),
    __metadata("design:paramtypes", [ProjectConfiguration])
], LoggerService);
export { LoggerService };
/**
 * Factory function to create a logger instance.
 * Should be used in conduction with the decorator function.
 * @see createLogger
 */
class LoggerFactoryTransformer {
    transform(incoming, args) {
        return incoming.buildLogger(args);
    }
}
/**
 * Decorator function used to inject an instance of the logger function rather then the logger service.
 * @param context Name to be used as context.
 * @return Instance of logger function
 * @see LoggerService.buildLogger
 */
export function createLogger(context) {
    return injectWithTransform(LoggerService, LoggerFactoryTransformer, context);
}
//# sourceMappingURL=loggerService.js.map