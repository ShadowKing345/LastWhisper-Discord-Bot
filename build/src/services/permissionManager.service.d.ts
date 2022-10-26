import { Role, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
/**
 * Service that manages the permissions of commands throughout the project.
 * The reason for this service is that while you are able to change certain permissions for regular slash commands, subcommands cannot have their permissions changed in the same way.
 */
export declare class PermissionManagerService {
    private permissionManagerRepository;
    private logger;
    private static readonly keys;
    private static _keysFormatted;
    constructor(permissionManagerRepository: PermissionManagerRepository, logger: pino.Logger);
    /**
     * Checks if a member is authorized to use the given key of a command.
     * @param interaction The interaction used to determine the rights.
     * @param key The name of the key to check against.
     */
    isAuthorized(interaction: ChatInputCommandInteraction, key: string): Promise<boolean>;
    /**
     * Adds a role to a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     * @param role The role.
     */
    addRole(interaction: ChatInputCommandInteraction, key: string, role: Role): Promise<InteractionResponse>;
    /**
     * Removes a role from a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     * @param role The role.
     */
    removeRole(interaction: ChatInputCommandInteraction, key: string, role: Role): Promise<InteractionResponse>;
    /**
     * Configures a permission.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     */
    config(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse>;
    /**
     * Resets all permission options and roles set.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission
     */
    reset(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse>;
    /**
     * List all permissions keys.
     * If key is set then it gives a detailed view of that permission settings.
     * @param interaction The interaction the command was invoked with.
     * @param key The key of the permission (optional)
     */
    listPermissions(interaction: ChatInputCommandInteraction, key?: string): Promise<InteractionResponse>;
    /**
     * Finds a config file or creates one.
     * @param id Id for the guild.
     * @private
     */
    private findOneOrCreate;
    /**
     * Adds a permission key to the list of keys.
     * @param key The key to be added.
     */
    static addPermissionKey(key: string): void;
    /**
     * Removes a permission from the list of keys.
     * @param key The key to be removed.
     */
    static removePermissionKey(key: string): void;
    /**
     * Checks to see if a key already exists.
     * @param key The key to check.
     * @private
     */
    static keyExists(key: string): boolean;
    /**
     * Creates or returns a formatted text of the keys.
     * Normalizes to be more readable.
     */
    static get keysFormatted(): string;
    /**
     * Internal decorator used to check if a key exists before a command is actually invoked.
     * @private
     */
    private static validateKey;
}
//# sourceMappingURL=permissionManager.service.d.ts.map