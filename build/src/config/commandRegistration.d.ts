/**
 * Command registration argument used when registering commands.
 */
declare type CommandRegistrationArgs = {
    /**
     * Token for bot.
     */
    token?: string;
    /**
     * Client discord id.
     */
    client?: string;
    /**
     * Guild discord id.
     * Set to register commands for this guild only.
     */
    guild?: string;
    /**
     * Set to true if you wish to unregister.
     */
    unregister?: boolean;
};
/**
 * Command that attempted to register the slash command to the bot.
 * @param args Arguments for command registration.
 */
export declare function commandRegistration(args: CommandRegistrationArgs): Promise<void>;
export {};
//# sourceMappingURL=commandRegistration.d.ts.map