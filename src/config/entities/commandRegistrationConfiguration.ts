export class CommandRegistrationConfiguration {
    public clientId: string = null;
    public guildId: string = null;
    public registerForGuild?: boolean = false;
    public unregister?: boolean = false;

    public get isValid(): boolean {
        if( !this.clientId ) {
            return false;
        }

        if( this.registerForGuild ) {
            return this.guildId != null;
        }

        return true;
    }
}
