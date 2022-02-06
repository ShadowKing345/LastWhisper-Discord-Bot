import winston, { format } from "winston";
export const loggerFormat = format.printf((info) => {
    return `[${info.timestamp}] [${info.level}]\t${info.context}: ${info.message}`;
});
export const logger = winston.createLogger({
    level: "info",
    format: format.combine(format(info => {
        info.level = info.level.toUpperCase();
        return info;
    })(), format.label({ label: "No Label" }), format.colorize(), format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), loggerFormat),
    defaultMeta: {
        context: "Context-less"
    },
    transports: [
        new winston.transports.Console()
    ],
    exitOnError: false
});
//# sourceMappingURL=logger.js.map