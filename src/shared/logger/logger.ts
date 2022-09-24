import { pino } from "pino";
import { singleton } from "tsyringe";

import { ProjectConfiguration } from "../../config/app_configs/index.js";

export enum LOGGING_LEVELS {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}

@singleton()
export class LoggerFactory {
    constructor(private appConfigs: ProjectConfiguration) {
    }

    buildLogger(name: string): pino.Logger {
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
}

