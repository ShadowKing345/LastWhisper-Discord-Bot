import { pino } from "pino";
import { initConfigs } from "../config/appConfigs.js";
export var LOGGING_LEVELS;
(function (LOGGING_LEVELS) {
    LOGGING_LEVELS["debug"] = "debug";
    LOGGING_LEVELS["info"] = "info";
    LOGGING_LEVELS["warn"] = "warn";
    LOGGING_LEVELS["error"] = "error";
})(LOGGING_LEVELS || (LOGGING_LEVELS = {}));
export function buildLogger(name) {
    return pino({
        name: name,
        level: initConfigs()?.logging_level ?? LOGGING_LEVELS.info,
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-MM-dd hh:mm:ss",
                ignore: "pid,hostname",
            },
        },
    });
}
//# sourceMappingURL=logger.js.map