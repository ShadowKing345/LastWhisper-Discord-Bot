import Constructor from "../../utils/constructor.js";
import constructor from "../../utils/constructor.js";
import { ConfigurationParser } from "../parsers/configurationParser.js";

export const RegisteredParsers: [ Constructor<ConfigurationParser>, string, number ][] = [];

export function RegisterConfigurationParser( name: string, extension: string, priority: number ) {
    console.debug( `Registering configuration parser ${ name }` );

    return function( target: constructor<ConfigurationParser> ) {
        RegisteredParsers.push( [ target, extension, priority ] );
    }
}