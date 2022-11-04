import { EmbedBuilder, Role, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/loggerService.js";
import { Permission, PermissionManagerConfig, PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
import { unFlattenObject } from "../utils/index.js";
import { InvalidArgumentError } from "../utils/errors/invalidArgumentError.js";

/**
 * Service that manages the permissions of commands throughout the project.
 * The reason for this service is that while you are able to change certain permissions for regular slash commands, subcommands cannot have their permissions changed in the same way.
 */
@singleton()
export class PermissionManagerService {
  private static readonly keys: string[] = [];
  private static _keysFormatted: string = null;

  constructor(
    private permissionManagerRepository: PermissionManagerRepository,
    @createLogger(PermissionManagerService.name) private logger: pino.Logger
  ) {}

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

    const config: PermissionManagerConfig = await this.findOneOrCreate(interaction.guildId);
    const permission: Permission = config.permissions[key];

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
   * Adds a role to a permission.
   * @param interaction The interaction the command was invoked with.
   * @param key The key of the permission
   * @param role The role.
   */
  @PermissionManagerService.validateKey()
  public async addRole(
    interaction: ChatInputCommandInteraction,
    key: string,
    role: Role
  ): Promise<InteractionResponse> {
    this.logger.debug(`Add role command invoked for guild ${interaction.guildId}.`);
    const config = await this.findOneOrCreate(interaction.guildId);
    const permissions = (config.permissions[key] ??= new Permission());

    if (permissions.roles.includes(role.id)) {
      return interaction.reply({
        content: `Role is already there. Will not add again.`,
        ephemeral: true,
      });
    }

    permissions.roles.push(role.id);
    await this.permissionManagerRepository.save(config);

    this.logger.debug("Role added successfully.");

    return interaction.reply({
      content: `Role added to key ${key}`,
      ephemeral: true,
    });
  }

  /**
   * Removes a role from a permission.
   * @param interaction The interaction the command was invoked with.
   * @param key The key of the permission
   * @param role The role.
   */
  @PermissionManagerService.validateKey()
  public async removeRole(
    interaction: ChatInputCommandInteraction,
    key: string,
    role: Role
  ): Promise<InteractionResponse> {
    this.logger.debug(`Remove role command invoked for guild ${interaction.guildId}.`);
    const config = await this.findOneOrCreate(interaction.guildId);

    const permission = config.permissions[key];
    if (!permission) {
      return interaction.reply({
        content: `Cannot find key ${key}`,
        ephemeral: true,
      });
    }

    const index = permission.roles.findIndex((r) => r === role.id);
    if (index === -1) {
      return interaction.reply({
        content: `Cannot find role ${role.name} in the permission list ${key}`,
        ephemeral: true,
      });
    }

    permission.roles.splice(index, 1);
    await this.permissionManagerRepository.save(config);

    this.logger.debug("Role removed successfully.");

    return interaction.reply({
      content: `Role removed for key ${key}`,
      ephemeral: true,
    });
  }

  /**
   * Configures a permission.
   * @param interaction The interaction the command was invoked with.
   * @param key The key of the permission
   */
  @PermissionManagerService.validateKey()
  public async config(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse> {
    this.logger.debug(`Config invoked for guild ${interaction.guildId}.`);
    const config = await this.findOneOrCreate(interaction.guildId);
    const permission = (config.permissions[key] ??= new Permission());

    const mode: number = interaction.options.getInteger("mode", false);
    if (mode != null) {
      permission.mode = mode;
    }

    const black_list: boolean = interaction.options.getBoolean("black_list");
    if (black_list != null) {
      permission.blackList = black_list;
    }

    await this.permissionManagerRepository.save(config);

    this.logger.debug("Permission settings changed and saved.");

    return interaction.reply({
      content: "Config set.",
      ephemeral: true,
    });
  }

  /**
   * Resets all permission options and roles set.
   * @param interaction The interaction the command was invoked with.
   * @param key The key of the permission
   */
  @PermissionManagerService.validateKey()
  public async reset(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse> {
    this.logger.debug(`Reset invoked for guild ${interaction.guildId}.`);
    const config = await this.findOneOrCreate(interaction.guildId);

    if (!config.permissions[key]) {
      this.logger.debug("No permissions options were set with this key for this guild. Exiting.");
      return interaction.reply({
        content: `Cannot find permissions with key \`${key}\`.`,
        ephemeral: true,
      });
    }

    delete config.permissions[key];
    await this.permissionManagerRepository.save(config);

    this.logger.debug("Permissions were reset.");

    return interaction.reply({
      content: `Permission ${key} was successfully reset (deleted).`,
      ephemeral: true,
    });
  }

  /**
   * List all permissions keys.
   * If key is set then it gives a detailed view of that permission settings.
   * @param interaction The interaction the command was invoked with.
   * @param key The key of the permission (optional)
   */
  public async listPermissions(interaction: ChatInputCommandInteraction, key?: string): Promise<InteractionResponse> {
    this.logger.debug(`Permission key list requested by guild ${interaction.guildId}.`);

    if (key) {
      this.logger.debug(`Detailed request information for key ${key}.`);

      if (!PermissionManagerService.keyExists(key)) {
        this.logger.debug("Key did not exist. Exiting out.");
        return interaction.reply({
          content: "Cannot find key. Please input the correct key.",
          ephemeral: true,
        });
      }

      const config = await this.findOneOrCreate(interaction.guildId);
      const permission = config.permissions[key] ?? new Permission();

      this.logger.debug("Permissions found returning parsed object.");

      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: `Settings for Permission ${key}`,
            fields: [
              {
                name: "Mode",
                value: PermissionMode[permission.mode],
                inline: false,
              },
              {
                name: "Is Blacklist",
                value: String(permission.blackList),
                inline: false,
              },
              {
                name: "Roles",
                value:
                  permission.roles.length > 0
                    ? (
                        await Promise.allSettled(
                          permission.roles.map((roleId) =>
                            interaction.guild?.roles.fetch(roleId).then((role) => role?.name)
                          )
                        )
                      ).join("\n")
                    : "No roles were set.",
                inline: false,
              },
            ],
          }).setColor("Random"),
        ],
        ephemeral: true,
      });
    } else {
      this.logger.debug("Key not specified. Returning all available keys.");

      return interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: "List of PermissionKeys",
            description: `\`\`\`\n${PermissionManagerService.keysFormatted}\n\`\`\``,
          }).setColor("Random"),
        ],
        ephemeral: true,
      });
    }
  }

  /**
   * Finds a config file or creates one.
   * @param id Id for the guild.
   * @private
   */
  private async findOneOrCreate(id: string | null): Promise<PermissionManagerConfig> {
    this.logger.debug(`Attempting to get config file for guild ${id}.`);

    if (!id) {
      throw new Error("Guild ID cannot be null.");
    }

    let result = await this.permissionManagerRepository.findOne({
      guildId: id,
    });
    if (result) return result;

    this.logger.debug("Config not found generating new one.");
    result = new PermissionManagerConfig();
    result.guildId = id;

    return await this.permissionManagerRepository.save(result);
  }

  /**
   * Adds a permission key to the list of keys.
   * @param key The key to be added.
   */
  public static addPermissionKey(key: string) {
    if (!PermissionManagerService.keyExists(key)) {
      PermissionManagerService.keys.push(key);
    }
  }

  /**
   * Removes a permission from the list of keys.
   * @param key The key to be removed.
   */
  public static removePermissionKey(key: string): void {
    if (PermissionManagerService.keyExists(key)) {
      PermissionManagerService.keys.splice(PermissionManagerService.keys.indexOf(key), 1);
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

    const obj: object = unFlattenObject(
      PermissionManagerService.keys.reduce((previousValue, currentValue) => {
        previousValue[currentValue] = currentValue;
        return previousValue;
      }, {})
    );

    function format(obj: object, index = 0) {
      const spaces = "\t".repeat(index);
      let result = "";

      for (const [key, value] of Object.entries(obj)) {
        result +=
          typeof value === "object" ? `${spaces}${key}:\n${format(value as object, index + 1)}` : `${spaces}${key};\n`;
      }

      return result;
    }

    return (PermissionManagerService._keysFormatted = format(obj));
  }

  /**
   * Internal decorator used to check if a key exists before a command is actually invoked.
   * @private
   */
  private static validateKey(): (
    target: PermissionManagerService,
    property: string | symbol,
    descriptor: PropertyDescriptor
  ) => PropertyDescriptor {
    return function (_target: PermissionManagerService, _property: string | symbol, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value as (
        interaction: ChatInputCommandInteraction,
        key: string,
        ...args: unknown[]
      ) => unknown;

      descriptor.value = function (interaction: ChatInputCommandInteraction, key: string, ...args: unknown[]) {
        if (!PermissionManagerService.keyExists(key)) {
          (this as PermissionManagerService).logger.debug("Key did not exist. Exiting out.");
          return interaction.reply({
            content:
              "Cannot find key. Please input a correct key. Use the list command to find out which keys are available.",
            ephemeral: true,
          });
        }

        return originalMethod.apply(this, [interaction, key, ...args]);
      };

      return descriptor;
    };
  }
}
