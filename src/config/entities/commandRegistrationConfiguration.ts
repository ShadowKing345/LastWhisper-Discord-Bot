export class CommandRegistrationConfiguration {
    public clientId: string = null;
    public guildId: string = null;
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
