import { __decorate, __metadata } from "tslib";
import { pino } from "pino";
import { singleton, injectWithTransform } from "tsyringe";
import { ProjectConfiguration } from "./models/index.js";
import { LOGGING_LEVELS } from "./models/loggerConfigs.js";
let LoggerService = class LoggerService {
    configs;
    pino;
    constructor(appConfigs) {
        this.configs = appConfigs.logger;
        this.pino = pino({
            level: this.configs?.level ?? LOGGING_LEVELS.info,
            transport: this.configs?.transports,
        });
    }
    buildLogger(context) {
        return this.pino.child({ context });
    }
};
LoggerService = __decorate([
    singleton(),
    __metadata("design:paramtypes", [ProjectConfiguration])
], LoggerService);
export { LoggerService };
class LoggerFactoryTransformer {
    transform(incoming, args) {
        return incoming.buildLogger(args);
    }
}
export function createLogger(context) {
    return injectWithTransform(LoggerService, LoggerFactoryTransformer, context);
}
//# sourceMappingURL=loggerService.js.map