/**
 * Configuration object for the logger service.
 */
export class LoggerConfigs {
    level = LOGGING_LEVELS.info;
    transports;
}
export var LOGGING_LEVELS;
(function (LOGGING_LEVELS) {
    LOGGING_LEVELS["debug"] = "debug";
    LOGGING_LEVELS["info"] = "info";
    LOGGING_LEVELS["warn"] = "warn";
    LOGGING_LEVELS["error"] = "error";
})(LOGGING_LEVELS || (LOGGING_LEVELS = {}));
//# sourceMappingURL=loggerConfigs.js.map