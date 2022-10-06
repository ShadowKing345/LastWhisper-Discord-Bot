export class LoggingConfigs {
    level = LOGGING_LEVELS.info;
    transports = {
        options: undefined,
        targets: []
    };
}
export var LOGGING_LEVELS;
(function (LOGGING_LEVELS) {
    LOGGING_LEVELS["debug"] = "debug";
    LOGGING_LEVELS["info"] = "info";
    LOGGING_LEVELS["warn"] = "warn";
    LOGGING_LEVELS["error"] = "error";
})(LOGGING_LEVELS || (LOGGING_LEVELS = {}));
//# sourceMappingURL=loggingConfigs.js.map