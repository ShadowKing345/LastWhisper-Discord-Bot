import { SlashCommand } from "../objects/index.js";

const reflect = globalThis.Reflect;

export class ReflectConstants {
    public static readonly MODULE_NAME = "Module:ModuleName";
    public static readonly MODULE_SUBCOMMANDS = "Module:Subcommands";
}

export const Reflect = {
    ...reflect,
    getModuleName: function( module: object ): string {
        return reflect.getMetadata( ReflectConstants.MODULE_NAME, module ) as string;
    },
    setModuleName: function( name: string, module: object ): void {
        return reflect.defineMetadata( ReflectConstants.MODULE_NAME, name, module );
    },
    getSubcommands: function( module: object ): SlashCommand[] {
        if( !reflect.hasMetadata( ReflectConstants.MODULE_SUBCOMMANDS, module ) ) {
            reflect.defineMetadata( ReflectConstants.MODULE_SUBCOMMANDS, [], module );
        }

        return reflect.getMetadata( ReflectConstants.MODULE_SUBCOMMANDS, module ) as SlashCommand[];
    }
};