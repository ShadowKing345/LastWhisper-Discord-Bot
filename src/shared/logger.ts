import { pino } from "pino";
import { singleton } from "tsyringe";
import { Transform } from "tsyringe/dist/typings/types/index.js";

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
                    translateTime: "yyyy-mm-dd hh:MM:ss",
                    ignore: "pid,hostname",
                },
            },
        });
    }
}

export class LoggerFactoryTransformer implements Transform<LoggerFactory, pino.Logger> {
    public transform(incoming: LoggerFactory, args: any): pino.Logger {
        return incoming.buildLogger(args);
    }
}