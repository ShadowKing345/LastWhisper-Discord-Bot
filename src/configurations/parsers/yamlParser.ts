import { PathLike, readFileSync } from "fs";
import { parse } from "yaml";
import { flattenObject } from "../../utils/index.js";
import { RegisterConfigurationParser } from "../decorators/registerConfigurationParser.js";
import { ConfigurationParser } from "./configurationParser.js";

@RegisterConfigurationParser( "YamlConfigurationParser", ".yml", 0 )
export class YamlConfigurationParser implements ConfigurationParser {
    public parse( pathLike: PathLike ): object {
        const data = readFileSync( pathLike, "utf-8" );
        const yaml = parse( data ) as object;

        return flattenObject( yaml );
    }
}
