import { Mergeable } from "../../utils/mergable.js";
import Configuration from "../decorators/configuration.js";
import { isArray } from "../../utils/index.js";

function parseModues( obj: unknown ): unknown {
    if( !isArray( obj ) ) {
        obj = String( obj ).split( ";" )
    }

    return ( obj as [] ).filter( item => typeof item === "string" );
}

/**
 * Configuration object for the module configuration service.
 */
@Configuration( "module" )
export class ModuleConfiguration implements Mergeable<ModuleConfiguration> {

    @Configuration.property( { parser: Boolean } )
    public enableCommands?: boolean = true;

    @Configuration.property( { parser: Boolean } )
    public enableEventListeners?: boolean = true;

    @Configuration.property( { parser: Boolean } )
    public enableTimers?: boolean = true;

    @Configuration.property( { parser: Boolean } )
    public enableInteractions?: boolean = true;

    @Configuration.property( { parser: Boolean } )
    public enableContextMenus?: boolean = true;

    @Configuration.property( { parser: parseModues } )
    public modules?: string[] = [ "DevModule" ];

    @Configuration.property( { parser: Boolean } )
    public blacklist?: boolean = true;

    public merge( obj: Partial<ModuleConfiguration> ): ModuleConfiguration {
        if( obj.enableCommands !== undefined ) {
            this.enableCommands = obj.enableCommands;
        }

        if( obj.enableEventListeners !== undefined ) {
            this.enableEventListeners = obj.enableEventListeners;
        }

        if( obj.enableTimers !== undefined ) {
            this.enableTimers = obj.enableTimers;
        }

        if( obj.enableInteractions !== undefined ) {
            this.enableInteractions = obj.enableInteractions;
        }

        if( obj.enableContextMenus !== undefined ) {
            this.enableContextMenus = obj.enableContextMenus;
        }

        if( isArray( obj.modules ) ) {
            this.modules = obj.modules.filter( item => typeof item === "string" );
        }

        if( obj.blacklist !== undefined ) {
            this.blacklist = obj.blacklist;
        }

        return this;
    }
}
