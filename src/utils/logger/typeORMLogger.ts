import { AbstractLogger, LogLevel, LogMessage, LogMessageType } from "typeorm";
import { DatabaseLoggerConfigs } from "../../config/index.js";
import { Logger } from "./logger.js";

export class TypeORMLogger extends AbstractLogger {
    private static readonly LOGGER = Logger.build( "DatabaseConnection" );
    private static readonly LEVELS: LogLevel[] = [ "query", "schema", "error", "warn", "info", "log", "migration" ];
    private readonly isEnabled: boolean;
    private readonly levels: LogLevel[] | "all";

    public constructor( opts: Partial<DatabaseLoggerConfigs> = new DatabaseLoggerConfigs() ) {
        super();
        this.isEnabled = opts.isEnabled ?? true;
        this.levels = opts.levels ?? "all";
    }

    protected writeLog( level: LogLevel, logMessages: LogMessage | string | number | ( LogMessage | string | number )[] ): void {
        const preparedMessages = this.prepareLogMessages( logMessages, {
            highlightSql: false,
        } );

        for( const preparedMessage of preparedMessages ) {
            const additional = {
                type: preparedMessage.type,
                prefix: preparedMessage.prefix,
                format: preparedMessage.format,
                parameters: preparedMessage.parameters,
                additionalInfo: preparedMessage.additionalInfo
            };
            
            switch( preparedMessage.type ) {
                case "log":
                case "info":
                    TypeORMLogger.LOGGER.debug( preparedMessage.message, additional );
                    break;
                case "schema-build":
                case "query":
                case "migration":
                    TypeORMLogger.LOGGER.info( preparedMessage.message, additional );
                    break;
                case "query-slow":
                case "warn":
                    TypeORMLogger.LOGGER.warn( preparedMessage.message, additional );
                    break;
                case "error":
                case "query-error":
                    TypeORMLogger.LOGGER.error( preparedMessage.message, additional );
                    break;
                default:
                    TypeORMLogger.LOGGER.error( `Unknown log level \`${ level as string }\`. Please fix.`, additional );
                    break;
            }
        }
    }

    protected isLogEnabledFor( type?: LogLevel | LogMessageType ): boolean {
        if( !this.isEnabled ) {
            return false;
        }

        if( this.levels === "all" ) {
            return true;
        }

        const flags = TypeORMLogger.LEVELS.reduce( ( prev, current ) => {
            prev[current] = this.levels.includes( current );
            return prev;
        }, {} ) as Record<LogLevel, boolean>;

        switch( type ) {
            case "query-error":
                return flags.query && flags.error;
            case "query-slow":
                return flags.query && flags.warn;
            case "schema-build":
                return flags.schema;
            default:
                return flags[type] ?? false;
        }
    }
}