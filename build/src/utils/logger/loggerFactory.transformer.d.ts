import { pino } from "pino";
import { Transform } from "tsyringe/dist/typings/types/index.js";
import { LoggerFactory } from "./logger.js";
export declare class LoggerFactoryTransformer implements Transform<LoggerFactory, pino.Logger> {
    transform(incoming: LoggerFactory, args: any): pino.Logger;
}
//# sourceMappingURL=loggerFactory.transformer.d.ts.map