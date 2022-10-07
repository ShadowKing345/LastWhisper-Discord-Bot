import { CommandInteraction } from "discord.js";
import { pino } from "pino";

import { authorize } from "../utils/decorators/authorize.js";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { PermissionKeysType } from "../models/permission_manager/index.js";

@registerModule()
export class BuffManagerModule extends ModuleBase {
    private static readonly commands: PermissionKeysType = new PermissionKeysType({
        name: "buff_manager",
        description: "Manages all things related to buffs",
        subcommands: {
            Buffs: {
                name: "buffs",
                description: "Shows you what buffs are set.",
                subcommands: {
                    Today: {
                        name: "today",
                        description: "Gets today's buff.",
                    },
                    Tomorrow: {
                        name: "tomorrow",
                        description: "Gets tomorrow's buff.",
                    },
                },
            },
            Weeks: {
                name: "weeks",
                description: "Shows you what buffs for the week, are set to.",
                subcommands: {
                    ThisWeek: {
                        name: "this_week",
                        description: "Gets this week's buffs.",
                    },
                    NextWeek: {
                        name: "next_week",
                        description: "Gets next week's buffs",
                    },
                },
            },
        },
    });

    constructor(
        private buffManagerService: BuffManagerService,
        @createLogger(BuffManagerModule.name) private logger: pino.Logger,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);

        this.moduleName = "BuffManager";
        this.commands = [
            {
                command: () => BuffManagerModule.commands.build(),
                run: async interaction => this.subcommandResolver(interaction),
            },
        ];
        this.tasks = [
            {
                name: `${this.moduleName}#dailyMessageTask`,
                timeout: 60000,
                run: async client => this.postDailyMessage(client),
            },
        ];
    }

    private subcommandResolver(interaction: CommandInteraction): Promise<void> {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);

        const group = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        if (!(subCommand && group)) {
            this.logger.debug(`Expected Failure:")} no "subcommand" or group was used.`);
            return interaction.reply({
                content: "Sorry you can only use the group or subcommands not the src command.",
                ephemeral: true,
            });
        }

        if (!interaction.guildId) {
            this.logger.debug(`Expected Failure: Command was attempted to be invoked inside of a direct message.`);
            return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }

        switch (group) {
            case (BuffManagerModule.commands.subcommands.Buffs as PermissionKeysType)?.name:
                switch (subCommand) {
                    case (BuffManagerModule.commands.subcommands.Buffs as PermissionKeysType)?.subcommands.Today:
                        return this.postTodayBuff(interaction);
                    case (BuffManagerModule.commands.subcommands.Buffs as PermissionKeysType)?.subcommands.Tomorrow:
                        return this.postTomorrowsBuff(interaction);
                    default:
                        this.logger.debug(`Expected Failure: Cannot find subcommand.`);
                        return interaction.reply({
                            content: "Cannot find subcommand.",
                            ephemeral: true,
                        });
                }
            case (BuffManagerModule.commands.subcommands.Weeks as PermissionKeysType)?.name:
                switch (subCommand) {
                    case (BuffManagerModule.commands.subcommands.Weeks as PermissionKeysType)?.subcommands.ThisWeek:
                        return this.postThisWeeksBuffs(interaction);
                    case (BuffManagerModule.commands.subcommands.Weeks as PermissionKeysType)?.subcommands.NextWeek:
                        return this.postNextWeeksBuffs(interaction);
                    default:
                        this.logger.debug(`Expected Failure: Cannot find subcommand.`);
                        return interaction.reply({
                            content: "Cannot find subcommand.",
                            ephemeral: true,
                        });
                }
            default:
                this.logger.debug(`Expected Failure: Cannot find subcommand group.`);
                return interaction.reply({
                    content: "Cannot find group.",
                    ephemeral: true,
                });
        }
    }

    @authorize()
    private postTodayBuff(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postBuff(interaction);
    }

    @authorize()
    private postTomorrowsBuff(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postBuff(interaction, false);
    }

    @authorize()
    private postThisWeeksBuffs(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postWeeksBuffs(interaction);
    }

    @authorize()
    private postNextWeeksBuffs(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postWeeksBuffs(interaction, false);
    }

    private postDailyMessage(client: Client): Promise<void> {
        return this.buffManagerService.postDailyMessage(client);
    }
}
