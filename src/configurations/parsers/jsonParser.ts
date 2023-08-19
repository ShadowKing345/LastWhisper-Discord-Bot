import { PathLike, readFileSync } from "fs";
import { flattenObject } from "../../utils/index.js";
import { RegisterConfigurationParser } from "../decorators/registerConfigurationParser.js";
import { ConfigurationParser } from "./configurationParser.js";

@RegisterConfigurationParser( "JsonConfigurationParser", ".json", 0 )
export class JsonConfigurationParser implements ConfigurationParser {
    public parse( pathLike: PathLike ): object {
        const data = readFileSync( pathLike, "utf-8" );
        const json = JSON.parse( data ) as object;

        return flattenObject( json );
    }
}