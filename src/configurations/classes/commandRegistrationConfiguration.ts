import Configuration from "../decorators/configuration.js";
import { Mergeable } from "../../utils/mergable.js";

@Configuration( "commandRegistration" )
export class CommandRegistrationConfiguration implements Mergeable<CommandRegistrationConfiguration> {

    @Configuration.property( { parser: String } )
    public clientId?: string;

    @Configuration.property( { parser: String } )
    public guildId?: string;

    @Configuration.property( { parser: Boolean } )
    public registerForGuild: boolean = false;

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
