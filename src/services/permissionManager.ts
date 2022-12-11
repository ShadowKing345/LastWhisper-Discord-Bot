import { ChatInputCommandInteraction } from "discord.js";

import { Permission, PermissionManagerConfig, PermissionMode } from "../entities/permissionManager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.js";
import { unFlattenObject } from "../utils/index.js";
import { InvalidArgumentError, BadAuthorizationKeyError, DecoratorError } from "../utils/errors/index.js";
import { Service } from "./service.js";
import { service } from "../utils/decorators/index.js";
import { Logger } from "../utils/logger.js";

/**
 * Service that manages the permissions of commands throughout the project.
 * The reason for this service is that while you are able to change certain permissions for regular slash commands, subcommands cannot have their permissions changed in the same way.
 */
@service()
export class PermissionManagerService extends Service {
  private readonly logger: Logger = new Logger(PermissionManagerService);
  private static readonly keys: string[] = [];
  private static _keysFormatted: string = null;

  constructor(
    private repository: PermissionManagerRepository,
  ) {
    super();
  }

  private getConfig(guildId: string): Promise<PermissionManagerConfig> {
    return this.repository.findOne({ where: { guildId } });
  }

  /**
   * Gets the permission object of a given key and config file. Null if none exist.
   * @param guildId Guild ID to ge the configuration from.
   * @param key Key for the permission.
   */
  @PermissionManagerService.validateKey(1)
  public async getPermission(guildId: string | null, key: string): Promise<Permission | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await this.getConfig(guildId))?.permissions?.[key];
  }

  /**
   * Sets the permission object of a given key and config file. Returns the saved version.
   * @param guildId Guild ID to ge the configuration from.
   * @param key Key for the permission.
   * @param permission The permission object to set.
   */
  @PermissionManagerService.validateKey(1)
  public async setPermission(guildId: string | null, key: string, permission: Permission): Promise<Permission | null> {
    const config = await this.getConfig(guildId);
    config.permissions[key] = permission;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await this.repository.save(config)).permissions[key];
  }

  /**
   * Checks if a member is authorized to use the given key of a command.
   * @param interaction The interaction used to determine the rights.
   * @param key The name of the key to check against.
   */
  public async isAuthorized(interaction: ChatInputCommandInteraction, key: string): Promise<boolean> {
    if (!PermissionManagerService.keyExists(key)) {
      (this as PermissionManagerService).logger.debug("Key did not exist. Exiting out.");
      await interaction.reply({
        content:
          "The authorization key for the command could not be found.\nThis is a critical error and the developer of the application should be informed.\nKindly create an issue on the github page and indicate the command you were trying to use as well as the options.",
        ephemeral: true,
      });
      return false;
    }

    this.logger.debug(`Attempting to authorize for key ${key}`);
    if (!interaction) {
      this.logger.error("An interaction was null that should not be. Throwing.");
      throw new InvalidArgumentError("Interaction was null. This is not allowed.");
    }

    // The guild owner should always be allowed to use commands to prevent a lockout scenario.
    if (interaction.guild?.ownerId === interaction.user.id) {
      this.logger.debug("User is owner. Returning true.");
      return true;
    }

    const permission: Permission = await this.getPermission(interaction.guildId, key);
    if (!permission) {
      this.logger.debug("Permissions do not exist. Defaulting to true.");
      return true;
    }

    let result: boolean;
    if (permission.roles.length === 0) {
      this.logger.debug(`Length is 0. Flag set to true.`);
      result = true;
    } else {
      const user = await interaction.guild?.members.fetch(interaction.user.id);

      if (!user) {
        throw new Error("This user is not within the guild.");
      }

      switch (permission.mode) {
        case PermissionMode.STRICT:
          result = user.roles.cache.hasAll(...permission.roles);
          break;
        case PermissionMode.ANY:
        default:
          result = user.roles.cache.hasAny(...permission.roles);
          break;
      }
    }

    const authorized: boolean = (!permission.blackList && result) || (permission.blackList && !result);

    this.logger.debug(`User is ${authorized ? "Authenticated" : "Unauthenticated"}.`);
    return authorized;
  }

  /**
   * Adds a permission key to the list of keys.
   * @param key The key to be added.
   */
  public static addPermissionKey(key: string) {
    if (!PermissionManagerService.keyExists(key)) {
      PermissionManagerService.keys.push(key);
      this._keysFormatted = null;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Removes a permission from the list of keys.
   * @param key The key to be removed.
   */
  public static removePermissionKey(key: string): void {
    if (PermissionManagerService.keyExists(key)) {
      PermissionManagerService.keys.splice(PermissionManagerService.keys.indexOf(key), 1);
      this._keysFormatted = null;
    }
  }

  /**
   * Checks to see if a key already exists.
   * @param key The key to check.
   * @private
   */
  public static keyExists(key: string): boolean {
    return PermissionManagerService.keys.includes(key);
  }

  /**
   * Creates or returns a formatted text of the keys.
   * Normalizes to be more readable.
   */
  public static get keysFormatted(): string {
    if (PermissionManagerService._keysFormatted) {
      return PermissionManagerService._keysFormatted;
    }

    const obj: object = unFlattenObject(PermissionManagerService.keys.reduce((p, c) => ({ ...p, [c]: c }), {}));

    function format(obj: object, index = 0) {
      const spaces = "\t".repeat(index);
      let result = "";

      for (const [ key, value ] of Object.entries(obj)) {
        result +=
          typeof value === "object" ? `${spaces}${key}:\n${format(value as object, index + 1)}` : `${spaces}${key};\n`;
      }

      return result;
    }

    return (PermissionManagerService._keysFormatted = format(obj));
  }

  /**
   * Internal decorator used to check if a key exists before a command is actually invoked.
   * @param index Position of argument in function parameter list.
   * @private
   */
  private static validateKey(
    index: number,
  ): (
    target: PermissionManagerService,
    property: string | symbol,
    descriptor: PropertyDescriptor,
  ) => PropertyDescriptor {
    return function(_target: PermissionManagerService, _property: string | symbol, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

      descriptor.value = function(...args: unknown[]) {
        const key = args[index];

        if (!(key && typeof key === "string")) {
          (this as PermissionManagerService).logger.error("Argument index resulted in null or not a string.");
          throw new DecoratorError("Argument index resulted in null or not a string.");
        }

        if (PermissionManagerService.keyExists(key)) {
          return originalMethod.apply(this, args);
        }

        (this as PermissionManagerService).logger.debug("Key did not exist. Exiting out.");
        throw new BadAuthorizationKeyError(
          "Cannot find key. Please input a correct key. Use the list command to find out which keys are available.",
        );
      };

      return descriptor;
    };
  }
}
