export class CommandRegistrationConfiguration {
    clientId = null;
    guildId = null;
    registerForGuild = false;
    unregister = false;
    get isValid() {
        if (!this.clientId) {
            return false;
        }
        return this.guildId && this.registerForGuild;
    }
}
//# sourceMappingURL=commandRegistrationConfiguration.js.map