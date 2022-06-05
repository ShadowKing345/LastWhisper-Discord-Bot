import { pino } from "pino";

import { initConfigs } from "../config/appConfigs.js";

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}

export function buildLogger(name: string) {
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