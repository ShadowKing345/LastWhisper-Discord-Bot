import { AbstractLogger, LogLevel, LogMessage, LogMessageType } from "typeorm";
import { DatabaseLoggerConfigs, LOGGING_LEVELS } from "../../config/index.js";
import { Logger } from "./logger.js";

export class TypeORMLogger extends AbstractLogger {
    private static readonly LOGGER: Logger = new Logger( "DatabaseConnection" );
    private readonly isEnabled: boolean = true;

    public constructor( opts: Partial<DatabaseLoggerConfigs> = new DatabaseLoggerConfigs() ) {
        super( opts.levels );
        this.isEnabled = opts.isEnabled;
    }

    protected writeLog( level: LogLevel | LogMessageType, logMessages: LogMessage | string | number | ( LogMessage | string | number )[] ): void {
        const preparedMessages = this.prepareLogMessages( logMessages );

        for( const message of preparedMessages ) {
            const dbData = {
                format: message.format,
                parameters: message.parameters,
                additionalInfo: message.additionalInfo
            };

            switch( level ) {
                case "schema-build":
                    TypeORMLogger.LOGGER.log(LOGGING_LEVELS.info, message, dbData);
                    break;
                case "log":
                case "info":
                case "query":
                case "schema":
                case "migration":
                    TypeORMLogger.LOGGER.log(LOGGING_LEVELS.info, message, dbData);
                    break;
                case "query-slow":
                case "warn":
                    TypeORMLogger.LOGGER.log(LOGGING_LEVELS.info, message, dbData);
                    break;
                case "error":
                case "query-error":
                    TypeORMLogger.LOGGER.log(LOGGING_LEVELS.info, message, dbData);
                    break;
                default:
                    TypeORMLogger.LOGGER.log( LOGGING_LEVELS.error, `Unknown log level \`${ level as string }\`. Please fix.`, { dbData } );
                    break;
            }
        }
    }

    protected isLogEnabledFor( type?: LogLevel | LogMessageType ): boolean {
        return this.isEnabled && super.isLogEnabledFor( type );
    }
}