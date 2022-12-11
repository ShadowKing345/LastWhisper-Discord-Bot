import { __decorate, __metadata, __param } from "tslib";
import { pino } from "pino";
import { singleton, inject } from "tsyringe";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { LOGGING_LEVELS } from "../utils/objects/loggerConfigs.js";
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
    __param(0, inject(`IOptional<${ProjectConfiguration.name}>`)),
    __metadata("design:paramtypes", [ProjectConfiguration])
], LoggerService);
export { LoggerService };
export class LoggerFactoryTransformer {
    transform(incoming, args) {
        return incoming.buildLogger(args);
    }
}
//# sourceMappingURL=loggerService.js.map