import { pino } from "pino";
import { Transform } from "tsyringe/dist/typings/types/index.js";

import { LoggerFactory } from "./logger.js";

export class LoggerFactoryTransformer implements Transform<LoggerFactory, pino.Logger> {
    public transform(incoming: LoggerFactory, args: any): pino.Logger {
        return incoming.buildLogger(args);
    }
}