import constructor from "../../utils/constructor.js";
import { applicationReflectPrefix } from "../../utils/reflect.js";

export const ConfigurationList: constructor<unknown>[] = [];

const ConfigurationReflectPrefix = applicationReflectPrefix + ":ConfigurationRegistration";

export enum ConfigurationReflectConstants {
    PREFIX = ConfigurationReflectPrefix + ":Prefix",
    PROPERTY_NAME_OVERRIDE = ConfigurationReflectPrefix + ":PropertyNameOverride"
}

export function property(name: string) {
    return function( target: object, key: string ) {
        console.log(name);
        
        Reflect.defineMetadata( ConfigurationReflectConstants.PROPERTY_NAME_OVERRIDE, key, target.constructor );
    };
}

function configuration<T>( prefix: string = null ) {
    console.log( "Class First" );

    return function( target: constructor<T> ) {
        console.log( "Class First 2" );

        console.log( prefix );

        Reflect.defineMetadata( ConfigurationReflectConstants.PREFIX, prefix, target );

        ConfigurationList.push( target );
    }
}

export const Configuration = { test: property };

configuration["property"] = property;

export default configuration;