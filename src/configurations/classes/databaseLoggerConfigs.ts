import { LogLevel } from "typeorm";
import { isArray } from "../../utils/index.js";
import Configuration from "../decorators/configuration.js";

@Configuration( "logger.database" )
export class DatabaseLoggerConfigs {
    @Configuration.property()
    public isEnabled?: boolean = false;

    @Configuration.property()
    public levels: LogLevel[] | "all" = "all";

    public constructor( data: Partial<DatabaseLoggerConfigs> = null ) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<DatabaseLoggerConfigs> ): DatabaseLoggerConfigs {
        if( obj.isEnabled != null ) {
            this.isEnabled = obj.isEnabled;
        }

        if( obj.levels ) {
            if( isArray( obj.levels ) ) {
                this.levels = obj.levels.filter( item => typeof item === "string" );
            }

            if( obj.levels === "all" ) {
                this.levels = "all";
            }
        }

        return this;
    }
}