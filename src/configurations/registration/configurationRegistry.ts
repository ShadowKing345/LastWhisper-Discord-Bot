import { globSync } from "glob";
import Constructor from "../../utils/constructor.js";
import { deepMerge } from "../../utils/index.js";
import { Mergeable } from "../../utils/mergable.js";
import { ConfigurationList, ConfigurationReflectConstants } from "../decorators/configuration.js";
import { RegisteredParsers } from "../decorators/registerConfigurationParser.js";
import { ConfigurationParser } from "../parsers/configurationParser.js";
import { ConfigurationObjectSettings, ConfigurationObjectSettingsProperty } from "./configurationObjectSettings.js";

export class ConfigurationRegistry {
    public static readonly envPrefix = "DISCORD_BOT_";

    public readonly contexts = [
        "common",
        "development"
    ];

    private readonly parsers: { [key: string]: { class: ConfigurationParser, priority: number } } = {};

    private configsPathPattern = "config/[configPrefix].[context].*";
    private configFilePrefix = "applicationConfig";

    private readonly registry: ConfigurationObjectSettings<unknown>[] = [];
    private configurationMap: Record<string, unknown>;

    public async postInit() {
        this.registerParsers();
        this.configurationMap = await this.getConfigurationRecords();
    }

    public registerConfigurations() {
        for( const configuration of ConfigurationList ) {
            this.registerConfiguration( configuration );
        }
    }

    public registerConfiguration<T>( constructor: Constructor<T> ): void {
        const settings = new ConfigurationObjectSettings( constructor );

        settings.prefix = Reflect.getMetadata( ConfigurationReflectConstants.PREFIX, constructor ) as string;
        settings.properties = Reflect.getMetadata( ConfigurationReflectConstants.PROPERTIES, constructor ) as Record<string, ConfigurationObjectSettingsProperty> || {};

        this.registry.push( settings )
    }

    public registerToDependencyInjector() {
        console.log( this.registry );
        // for( const configuration of this.registry ) {
        //     const obj = this.getConfiguration( configuration.target );
        //
        //     container.register( configuration.target, { useValue: obj } );
        // }
    }

    public getConfiguration<T>( target: Constructor<T> ): T {
        const setting = this.registry.find( item => item.target === target );

        if( !setting ) {
            throw new Error( `Cannot find target "${ target.name }" in registered configurations.` );
        }

        const obj = new target();
        const result: Record<string, unknown> = {};
        const configMap = this.getConfigByPrefix( setting.prefix );

        for( const key in obj ) {
            if( !( key in setting.properties ) ) {
                continue;
            }

            const property = setting.properties[key];

            if( property.name in configMap ) {
                result[key] = configMap[property.name];
            }

            const envName = property.name.toUpperCase().replace( /\./g, "_" );
            if( envName in configMap ) {
                result[key] = configMap[envName];
            }

            if( property.parser && key in result ) {
                result[key] = property.parser( result[key] );
            }
        }

        if( typeof obj === "object" && "merge" in obj && typeof obj.merge === "function" ) {
            return ( obj as Mergeable<T> ).merge( result as Partial<T> );
        }

        return deepMerge( obj as object, result as object ) as T;
    }

    public getConfigByPrefix( prefix: string ): Record<string, unknown> {
        const envPrefix = ConfigurationRegistry.envPrefix + prefix.toUpperCase().replaceAll( /\./g, "_" );

        return Object.entries( this.configurationMap )
            .filter( item =>
                item[0].startsWith( prefix ) ||
                item[0].startsWith( envPrefix )
            )
            .reduce( ( previousValue, currentValue ) => {
                const key = currentValue[0].replace( prefix + ".", "" ).replace( envPrefix + "_", "" );
                previousValue[key] = currentValue[1];
                return previousValue;
            }, {} as Record<string, unknown> );
    }

    public async getConfigurationRecords( records: Record<string, unknown> = {} ) {
        const configs = this.getFilteredConfigurationFiles();

        await this.parseFiles( configs, records );
        this.getEnvVariables( records );

        return records;
    }

    public getEnvVariables( records: Record<string, unknown> = {} ): Record<string, unknown> {
        const envs = Object.entries( process.env )
            .filter( item => item[0].startsWith( ConfigurationRegistry.envPrefix ) );

        for( const [ key, value ] of envs ) {
            records[key] = value;
        }

        return records;
    }

    public async parseFiles( configs: string[], records: Record<string, unknown> = {} ): Promise<Record<string, unknown>> {
        const files: { [key: string]: string[] } = {};

        const pattern = this.configsPathPattern.replaceAll( /\[configPrefix]/g, this.configFilePrefix );
        const re = RegExp( pattern.replace( /\[context]/g, "(\\w+)" ) )

        const contextList = Object.entries( configs.reduce( ( previousValue, currentValue ) => {
                const context = re.exec( currentValue )[1];

                if( !( context in previousValue ) ) {
                    previousValue[context] = [];
                }

                previousValue[context].push( currentValue );
                return previousValue;
            }, {} as Record<string, string[]> )
        ).sort( ( a, b ) => this.contexts.indexOf( a[0] ) - this.contexts.indexOf( b[0] ) );

        for( const [ , contextFiles ] of contextList ) {
            for( const config of contextFiles ) {
                const extension = "." + config.split( "." ).at( -1 );
                if( !( extension in this.parsers ) ) {
                    console.warn( `No parsers configured for extension '${ extension }'. Skipping...` );
                    continue;
                }

                if( extension in files ) {
                    files[extension].push( config );
                } else {
                    files[extension] = [ config ];
                }
            }

            const parsersList = Object.entries( this.parsers ).sort( ( a, b ) => a[1].priority - b[1].priority );

            for( const [ extension, obj ] of parsersList ) {
                if( !( extension in files ) ) {
                    continue;
                }

                for( const file of files[extension] ) {
                    const result = await obj.class.parse( file );
                    for( const [ key, value ] of Object.entries( result ) ) {
                        records[key] = value;
                    }
                }
            }
        }

        return records;
    }

    public getFilteredConfigurationFiles(): string[] {
        const pattern = this.configsPathPattern.replaceAll( /\[configPrefix]/g, this.configFilePrefix );
        const patterns = this.contexts.map( context => pattern.replaceAll( /\[context]/g, context ) );
        return globSync( patterns ).filter( item => item.includes( this.configFilePrefix ) );
    }

    public registerParsers() {
        for( const parser of RegisteredParsers ) {
            this.registerParser( ...parser );
        }
    }

    public registerParser( parser: Constructor<ConfigurationParser>, extension: string, priority: number ) {
        this.parsers[extension] = { class: new parser(), priority };
    }
}