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
import { singleton } from "tsyringe";
import { ProjectConfiguration } from "../../config/app_configs/index.js";
export var LOGGING_LEVELS;
(function (LOGGING_LEVELS) {
    LOGGING_LEVELS["debug"] = "debug";
    LOGGING_LEVELS["info"] = "info";
    LOGGING_LEVELS["warn"] = "warn";
    LOGGING_LEVELS["error"] = "error";
})(LOGGING_LEVELS || (LOGGING_LEVELS = {}));
let LoggerFactory = class LoggerFactory {
    appConfigs;
    constructor(appConfigs) {
        this.appConfigs = appConfigs;
    }
    buildLogger(name) {
        return pino({
            name: name,
            level: this.appConfigs.logging_level ?? LOGGING_LEVELS.info,
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: "yyyy-mm-dd hh:MM:ss",
                    ignore: "pid,hostname",
                },
            },
        });
    }
};
LoggerFactory = __decorate([
    singleton(),
    __metadata("design:paramtypes", [ProjectConfiguration])
], LoggerFactory);
export { LoggerFactory };
//# sourceMappingURL=logger.js.map