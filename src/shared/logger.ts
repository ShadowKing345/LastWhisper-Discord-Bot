import { pino } from "pino";

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}

export function buildLogger(name: string) {
    return pino({
        name: name,
        // Todo: reimplement the logging level.
        // level: container.resolve(AppConfigs).config?.logging_level ?? LOGGING_LEVELS.info,
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-MM-dd hh:mm:ss",
                ignore: "pid,hostname",
            },
        },
    });
}