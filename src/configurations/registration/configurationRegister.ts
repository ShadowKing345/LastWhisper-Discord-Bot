import { ConfigurationList, ConfigurationReflectConstants } from "../../decorators/configurations/configuration.js";
import Constructor from "../../utils/constructor.js";
import { ConfigurationObject } from "./configurationObject.js";

const ConfigurationObjectList: ConfigurationObject<unknown>[] = [];

export function gatherConfigurationClasses() {
    for( const constructor of ConfigurationList || [] ) {
        registerConfigurationClass( constructor );
    }
}

export function registerConfigurationClass<T>( constructor: Constructor<T> ) {
    const configurationObject = new ConfigurationObject();

    configurationObject.target = constructor;

    if( Reflect.hasMetadata( ConfigurationReflectConstants.PREFIX, constructor ) ) {
        configurationObject.prefix = Reflect.getMetadata( ConfigurationReflectConstants.PREFIX, constructor ) as string;
    }

    ConfigurationObjectList.push( configurationObject );
}