import chalk from "chalk";
import { createLogger, format, Logform, Logger, transports } from "winston";

export const loggerFormat = format.printf((info: Logform.TransformableInfo) => {
    return `[${info.timestamp}] [${info.level}]\t${chalk.yellowBright(info.context)}: ${info.message}`;
});

export const logger: Logger = createLogger(
    {
        level: "info",
        format: format.combine(
            format(info => {
                info.level = info.level.toUpperCase();
                return info;
            })(),
            format.label({ label: "No Label" }),
            format.colorize({
                colors: {
                    debug: "bold italic blue",
                    info: "bold cyan",
                    warning: "bold yellow",
                    error: "bold red",
                },
            }),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            loggerFormat,
        ),
        defaultMeta: {
            context: "Context-less",
        },
        transports: [
            new transports.Console(),
        ],
        exitOnError: false,
    },
);
