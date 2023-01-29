export class CommandRegistrationConfiguration {
    clientId = null;
    guildId = null;
    registerForGuild = false;
    unregister = false;
    get isValid() {
        if (!this.clientId) {
            return false;
        }
        if (this.registerForGuild) {
            return this.guildId != null;
        }
        return true;
    }
}
//# sourceMappingURL=commandRegistrationConfiguration.js.map