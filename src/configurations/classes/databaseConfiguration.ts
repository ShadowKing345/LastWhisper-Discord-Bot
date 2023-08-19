import { Mergeable } from "../../utils/mergable.js";
import Configuration from "../decorators/configuration.js";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";

function portParser( obj: unknown ): unknown {
    console.log(obj);
    
    const result = Number( obj );
    if( isNaN( result ) ) {
        throw new Error( "Port has to be a number." );
    }

    return result;
}

@Configuration( "database" )
export class DatabaseConfiguration implements PostgresConnectionOptions, Mergeable<DatabaseConfiguration> {

    public readonly type = "postgres";

    @Configuration.property( { parser: String } )
    public username?: string = "postgresql";

    @Configuration.property( { parser: String } )
    public password?: string = "postgresql";

    @Configuration.property( { parser: String } )
    public host?: string = "127.0.0.1";

    @Configuration.property( { parser: portParser } )
    public port?: number = 5432;

    @Configuration.property( { parser: String } )
    public database?: string = "Bot";

    public merge( obj: Partial<DatabaseConfiguration> ): DatabaseConfiguration {
        if( obj.username && typeof obj.username === "string" ) {
            this.username = obj.username;
        }

        if( obj.password && typeof obj.password === "string" ) {
            this.password = obj.password;
        }

        if( obj.host && typeof obj.host === "string" ) {
            this.host = obj.host;
        }

        if( obj.port && typeof obj.port === "number" ) {
            this.port = obj.port;
        }

        if( obj.database && typeof obj.database === "string" ) {
            this.database = obj.database;
        }

        return this;
    }
}
