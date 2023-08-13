import Configuration from "../../decorators/configurations/configuration.js";
import { Mergeable } from "../../utils/mergable.js";

@Configuration( "commandRegistration" )
export class CommandRegistrationConfiguration implements Mergeable<CommandRegistrationConfiguration> {
    public clientId: string = null;
    public guildId: string = null;

    @Configuration.property( "register.for.guild" )
    public registerForGuild?: boolean = false;

    public get isValid(): boolean {
        if( !this.clientId ) {
            return false;
        }

        if( this.registerForGuild ) {
            return this.guildId != null;
        }

        return true;
    }

    public merge( obj: Partial<CommandRegistrationConfiguration> ): this {
        if( obj.clientId && typeof obj.clientId === "string" ) {
            this.clientId = obj.clientId;
        }

        if( obj.guildId && typeof obj.guildId === "string" ) {
            this.guildId = obj.guildId;
        }

        if( typeof obj.registerForGuild === "boolean" ) {
            this.registerForGuild = obj.registerForGuild;
        }

        return this;
    }
}
