import constructor from "../../utils/constructor.js";
import { applicationReflectPrefix } from "../../utils/reflect.js";
import { ConfigurationObjectSettingsProperty } from "../registration/configurationObjectSettings.js";

export const ConfigurationList: constructor<unknown>[] = [];

const ConfigurationReflectPrefix = applicationReflectPrefix + ":ConfigurationRegistration";

export enum ConfigurationReflectConstants {
    PREFIX = ConfigurationReflectPrefix + ":Prefix",
    PROPERTIES = ConfigurationReflectPrefix + ":Properties",
}

export function property( opts: { nameOverride?: string, parser?: ( obj: unknown ) => unknown } = {} ) {
    return function( target: object, key: string ) {
        const name = opts?.nameOverride || key;
        const type = Reflect.getMetadata( "design:type", target, key ) as unknown;

        if( !Reflect.hasMetadata( ConfigurationReflectConstants.PROPERTIES, target.constructor ) ) {
            Reflect.defineMetadata( ConfigurationReflectConstants.PROPERTIES, {
                [key]: {
                    name,
                    type,
                    parser: opts.parser
                }
            }, target.constructor );
            return;
        }

        ( Reflect.getMetadata( ConfigurationReflectConstants.PROPERTIES, target.constructor ) as Record<string, ConfigurationObjectSettingsProperty> )[key] = {
            name,
            type,
            parser: opts.parser
        };
    };
}

function configuration<T>( prefix: string ) {
    return function( target: constructor<T> ) {
        Reflect.defineMetadata( ConfigurationReflectConstants.PREFIX, prefix, target );

        ConfigurationList.push( target );
    }
}

export const Configuration = { property };

configuration["property"] = property;

export default configuration;