import { PathLike, readdirSync, readFileSync } from "fs";
import path from "path";
import { ApplicationConfiguration } from "./configurations/index.js";
import { flattenObject } from "./utils/index.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { parse as YAMLParser } from "yaml";

const records: Record<string, unknown> = {};

const contexts = [ "common" ];
const allowedExtensions: [ string, ( path: PathLike ) => object | Promise<object> ][] = [
    [ ".json", fromJson ],
    [ ".yml", fromYaml ],
    [ ".js", fromJs ],
];

const configsPath = "config";
const configFilePrefix = "applicationConfig";

// const configFileSyntax = "%configFilePrefix%.%context%";

export async function getConfigurations() {
    const configs = readdirSync( configsPath ).filter( item => item.startsWith( configFilePrefix ) );

    for( const config of configs ) {
        for( const [ extension, parser ] of allowedExtensions ) {
            if( config.endsWith( extension ) ) {
                const result = await parser( path.join( configsPath, config ) );
                for( const [ key, value ] of Object.entries( result ) ) {
                    records[key] = value;
                }
            }
        }
    }

    console.log( records, contexts )
}

function fromJson( pathLike: PathLike ) {
    const data = readFileSync( pathLike, "utf-8" );
    const json = JSON.parse( data ) as object;

    return flattenObject( json );
}

async function fromYaml( pathLike: PathLike ) {
    let YAML: { parse: typeof YAMLParser };

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        YAML = await import("yaml");
    } catch( e ) {
        throw new Error( "Cannot find yaml module. Kindly install it to be able to parse .yml files." );
    }

    const data = readFileSync( pathLike, "utf-8" );
    const yaml = YAML.parse( data ) as object;

    return flattenObject( yaml );
}

async function fromJs( pathLike: PathLike ) {
    const config = new ApplicationConfiguration();
    const module = await import(path.resolve( pathLike.toString() )) as object;

    if( !( "config" in module && typeof module.config === "function" ) ) {
        throw new SyntaxError( "Cannot find the function `config`" );
    }

    return flattenObject( await ( module.config as ( config: ApplicationConfiguration ) => ApplicationConfiguration | Promise<ApplicationConfiguration> )( config ) );
}