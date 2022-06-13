import Logger, { pino } from "pino";
import { singleton } from "tsyringe";

import { AppConfigs } from "../config/app_configs/index.js";

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}

@singleton()
export class LoggerFactory {
    constructor(
        private appConfigs: AppConfigs,
    ) {
    }

    buildLogger(name: string): pino.Logger {
        return pino({
            name: name,
            level: this.appConfigs?.config?.logging_level ?? LOGGING_LEVELS.info,
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: "yyyy-MM-dd hh:mm:ss",
                    ignore: "pid,hostname",
                },
            },
        });
    }
}