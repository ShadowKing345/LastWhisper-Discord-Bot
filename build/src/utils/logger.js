import chalk from "chalk";
import { createLogger, format, transports } from "winston";
export const loggerFormat = format.printf((info) => {
    return `${info.timestamp} ${chalk.yellowBright(info.context)} [${info.level}]: ${info.message}`;
});
export var LOGGING_LEVELS;
(function (LOGGING_LEVELS) {
    LOGGING_LEVELS["emerg"] = "emerg";
    LOGGING_LEVELS["alert"] = "alert";
    LOGGING_LEVELS["crit"] = "crit";
    LOGGING_LEVELS["error"] = "error";
    LOGGING_LEVELS["warning"] = "warning";
    LOGGING_LEVELS["notice"] = "notice";
    LOGGING_LEVELS["info"] = "info";
    LOGGING_LEVELS["debug"] = "debug";
})(LOGGING_LEVELS || (LOGGING_LEVELS = {}));
export const logger = createLogger({
    level: "info",
    format: format.combine(format(info => {
        info.level = info.level.toUpperCase();
        return info;
    })(), format.label({ label: "No Label" }), format.colorize({
        colors: {
            debug: "bold italic blue",
            info: "bold cyan",
            warning: "bold yellow",
            error: "bold red",
        },
    }), format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), loggerFormat),
    defaultMeta: {
        context: "Context-less",
    },
    transports: [
        new transports.Console(),
    ],
    exitOnError: false,
});
//# sourceMappingURL=logger.js.map