import { Level, TransportMultiOptions, TransportPipelineOptions, TransportSingleOptions } from "pino";
import { isStringNullOrEmpty } from "../../utils/index.js";
import Configuration from "../decorators/configuration.js";
import { DatabaseLoggerConfigs } from "./databaseLoggerConfigs.js";

export class LOGGING_LEVELS {
    public static readonly debug: Level = "debug";
    public static readonly info: Level = "info";
    public static readonly warn: Level = "warn";
    public static readonly error: Level = "error";
}

/**
 * Configuration object for the logger service.
 */
@Configuration( "logger" )
export class LoggerConfigs {
    @Configuration.property()
    public level: Level = LOGGING_LEVELS.info;

    @Configuration.property()
    public transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions = null;

    @Configuration.property()
    public disable = false;

    @Configuration.property()
    public database: DatabaseLoggerConfigs = new DatabaseLoggerConfigs();

    public constructor( data: Partial<LoggerConfigs> = null ) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<LoggerConfigs> ): LoggerConfigs {
        if( !isStringNullOrEmpty( obj.level ) ) {
            this.level = obj.level;
        }

        if( obj.transports ) {
            this.transports = obj.transports;
        }

        if( obj.database ) {
            this.database = this.database?.merge( obj.database ) ?? new DatabaseLoggerConfigs( obj.database );
        }

        return this;
    }
}
