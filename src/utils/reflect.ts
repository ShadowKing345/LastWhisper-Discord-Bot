import { SlashGroupCommand, SlashSubCommand } from "../objects/index.js";

const reflect = globalThis.Reflect;

export const applicationReflectPrefix = "__DiscordBotApplication";

export class ReflectConstants {
    public static readonly MODULE_NAME = applicationReflectPrefix + ":Module:ModuleName";
    public static readonly MODULE_SUBCOMMANDS = applicationReflectPrefix + ":Module:Subcommands";
}

export const Reflect = {
    ...reflect,
    getModuleName: function( module: object ): string {
        return reflect.getMetadata( ReflectConstants.MODULE_NAME, module ) as string;
    },
    setModuleName: function( name: string, module: object ): void {
        return reflect.defineMetadata( ReflectConstants.MODULE_NAME, name, module );
    },
    getSubcommands: function( module: object ): ( SlashSubCommand | SlashGroupCommand )[] {
        if( !reflect.hasMetadata( ReflectConstants.MODULE_SUBCOMMANDS, module ) ) {
            reflect.defineMetadata( ReflectConstants.MODULE_SUBCOMMANDS, [], module );
        }

        return reflect.getMetadata( ReflectConstants.MODULE_SUBCOMMANDS, module ) as ( SlashSubCommand | SlashGroupCommand )[];
    }
};