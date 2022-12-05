import { __decorate, __metadata } from "tslib";
import { pino } from "pino";
import { singleton, injectWithTransform } from "tsyringe";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { LOGGING_LEVELS } from "../utils/objects/loggerConfigs.js";
import { Service } from "./service.js";
let LoggerService = class LoggerService extends Service {
    configs;
    pino;
    constructor(appConfigs) {
        super();
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