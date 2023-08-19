import { PathLike, readFileSync } from "fs";
import { isStringNullOrEmpty } from "../../utils/index.js";
import { RegisterConfigurationParser } from "../decorators/registerConfigurationParser.js";
import { ConfigurationRegistry } from "../registration/configurationRegistry.js";
import { ConfigurationParser } from "./configurationParser.js";

@RegisterConfigurationParser( "EnvConfigurationParser", ".env", 1 )
export class EnvConfigurationParser implements ConfigurationParser {
    public parse( pathLike: PathLike ): object {
        const result: Record<string, unknown> = {};
        const data = readFileSync( pathLike, "utf-8" );
        for( const line of data.split( "\n" ).filter( item => !isStringNullOrEmpty( item ) ) ) {
            const splitIndex = line.indexOf( "=" );
            result[ConfigurationRegistry.envPrefix + line.substring( 0, splitIndex )] = line.substring( splitIndex + 1 );
        }

        return result;
    }
}