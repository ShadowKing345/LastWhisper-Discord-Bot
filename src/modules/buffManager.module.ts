import { CommandInteraction } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { addCommandKeys, authorize } from "../permission_manager/index.js";
import { createLogger } from "../utils/logger/logger.decorator.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";

@singleton()
export class BuffManagerModule extends ModuleBase {
    @addCommandKeys()
    private static readonly commands = {
        $index: "buff_manager",
        Buffs: { $index: "buffs", Today: "today", Tomorrow: "tomorrow" },
        Weeks: { $index: "weeks", ThisWeek: "this_week", NextWeek: "next_week" },
    };

    constructor(
        private buffManagerService: BuffManagerService,
        @createLogger(BuffManagerModule.name) private logger: pino.Logger,
    ) {
        super();

        this.moduleName = "BuffManager";
        this.commands = [
            {
                command: builder =>
                    builder
                        .setName(BuffManagerModule.commands.$index)
                        .setDescription("Manages all things related to buffs")
                        .addSubcommandGroup(subGroup =>
                            subGroup
                                .setName(BuffManagerModule.commands.Buffs.$index)
                                .setDescription("Shows you what buffs are set.")
                                .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule.commands.Buffs.Today).setDescription("Gets today's buff."))
                                .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule.commands.Buffs.Tomorrow).setDescription("Gets tomorrow's buff.")),
                        )
                        .addSubcommandGroup(subGroup =>
                            subGroup
                                .setName(BuffManagerModule.commands.Weeks.$index)
                                .setDescription("Shows you what buffs for the week, are set to.")
                                .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule.commands.Weeks.ThisWeek).setDescription("Gets this week's buffs."))
                                .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule.commands.Weeks.NextWeek).setDescription("Gets next week's buffs")),
                        ),
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
            case BuffManagerModule.commands.Buffs.$index:
                switch (subCommand) {
                    case BuffManagerModule.commands.Buffs.Today:
                        return this.postTodayBuff(interaction);
                    case BuffManagerModule.commands.Buffs.Tomorrow:
                        return this.postTomorrowsBuff(interaction);
                    default:
                        this.logger.debug(`Expected Failure: Cannot find subcommand.`);
                        return interaction.reply({
                            content: "Cannot find subcommand.",
                            ephemeral: true,
                        });
                }
            case BuffManagerModule.commands.Weeks.$index:
                switch (subCommand) {
                    case BuffManagerModule.commands.Weeks.ThisWeek:
                        return this.postThisWeeksBuffs(interaction);
                    case BuffManagerModule.commands.Weeks.NextWeek:
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

    @authorize(BuffManagerModule.commands.$index, BuffManagerModule.commands.Buffs.$index, BuffManagerModule.commands.Buffs.Today)
    private postTodayBuff(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postBuff(interaction);
    }

    @authorize(BuffManagerModule.commands.$index, BuffManagerModule.commands.Buffs.$index, BuffManagerModule.commands.Buffs.Tomorrow)
    private postTomorrowsBuff(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postBuff(interaction, false);
    }

    @authorize(BuffManagerModule.commands.$index, BuffManagerModule.commands.Weeks.$index, BuffManagerModule.commands.Weeks.ThisWeek)
    private postThisWeeksBuffs(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postWeeksBuffs(interaction);
    }

    @authorize(BuffManagerModule.commands.$index, BuffManagerModule.commands.Weeks.$index, BuffManagerModule.commands.Weeks.NextWeek)
    private postNextWeeksBuffs(interaction: CommandInteraction): Promise<void> {
        return this.buffManagerService.postWeeksBuffs(interaction, false);
    }

    private postDailyMessage(client: Client): Promise<void> {
        return this.buffManagerService.postDailyMessage(client);
    }
}
