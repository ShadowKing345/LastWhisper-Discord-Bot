import { TransportSingleOptions, TransportMultiOptions, TransportPipelineOptions, Level } from "pino";
import { LogLevel } from "typeorm";
import { isArray, isStringNullOrEmpty } from "../../utils/index.js";

/**
 * Configuration object for the logger service.
 */
export class LoggerConfigs {
    public level: Level = LOGGING_LEVELS.info;
    public transports: TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions = null;
    public disable = false;

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

export class DatabaseLoggerConfigs {
    public isEnabled?: boolean = false;
    public levels: LogLevel[] = [];

    public constructor( data: Partial<DatabaseLoggerConfigs> = null) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<DatabaseLoggerConfigs> ): DatabaseLoggerConfigs {
        if( obj.isEnabled != null ) {
            this.isEnabled = obj.isEnabled;
        }

        if( obj.levels && isArray( obj.levels ) ) {
            this.levels = obj.levels.filter( item => typeof item === "string" );
        }

        return this;
    }
}

export class LOGGING_LEVELS {
    public static readonly debug: Level = "debug";
    public static readonly info: Level = "info";
    public static readonly warn: Level = "warn";
    public static readonly error: Level = "error";
}
