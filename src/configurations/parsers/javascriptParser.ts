import { PathLike } from "fs";
import path from "path";
import { flattenObject } from "../../utils/index.js";
import { RegisterConfigurationParser } from "../decorators/registerConfigurationParser.js";
import { ConfigurationParser } from "./configurationParser.js";

@RegisterConfigurationParser( "JavascriptConfigurationParser", ".js", 2 )
export class JavascriptConfigurationParser implements ConfigurationParser {
    public async parse( pathLike: PathLike ): Promise<object> {
        // To keep the import chain safe I am purposefully not importing ApplicationConfiguration.
        const config = {};
        const module = await import(path.resolve( pathLike.toString() )) as object;

        if( !( "config" in module && typeof module.config === "function" ) ) {
            throw new SyntaxError( "Cannot find the function `config`" );
        }

        return flattenObject( await ( module.config as ( config: Record<string, unknown> ) => Record<string, unknown> | Promise<Record<string, unknown>> )( config ) );
    }
}