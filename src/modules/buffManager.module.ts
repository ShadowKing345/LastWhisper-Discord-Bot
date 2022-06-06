import chalk from "chalk";
import { CommandInteraction } from "discord.js";
import { injectable } from "tsyringe";

import { Client } from "../classes/client.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { buildLogger } from "../utils/logger.js";

@injectable()
export class BuffManagerModule extends ModuleBase {
    private readonly logger = buildLogger(BuffManagerModule.name);

    constructor(private buffManagerService: BuffManagerService) {
        super();

        this.moduleName = "BuffManager";
        this.commands = [
            {
                command: builder =>
                    builder
                        .setName("buff_manager")
                        .setDescription("Manages all things related to buffs")
                        .addSubcommandGroup(subGroup =>
                            subGroup
                                .setName("buffs")
                                .setDescription("Shows you what buffs are set.")
                                .addSubcommand(subBuilder => subBuilder.setName("today").setDescription("Gets today's buff."))
                                .addSubcommand(subBuilder => subBuilder.setName("tomorrow").setDescription("Gets tomorrow's buff.")),
                        )
                        .addSubcommandGroup(subGroup =>
                            subGroup
                                .setName("weeks")
                                .setDescription("Shows you what buffs for the week, are set to.")
                                .addSubcommand(subBuilder => subBuilder.setName("this_week").setDescription("Gets this week's buffs."))
                                .addSubcommand(subBuilder => subBuilder.setName("next_week").setDescription("Gets next week's buffs")),
                        ),
                run: async interaction => this.subCommandManager(interaction),
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

    private subCommandManager(interaction: CommandInteraction): Promise<void> {
        this.logger.debug(`${chalk.cyan("Command invoked")}, dealing with subcommand options.`);

        const group = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        if (!(subCommand && group)) {
            this.logger.debug(`${chalk.red("Expected Failure:")} no ${chalk.blue("subcommand")} or ${chalk.blue("group")} was used.`);
            return interaction.reply({
                content: "Sorry you can only use the group or subcommands not the src command.",
                ephemeral: true,
            });
        }

        if (!interaction.guildId) {
            this.logger.debug(`${chalk.red("Expected Failure:")} Command was attempted to be invoked inside of a direct message.`);
            return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }

        if (group === "buffs") {
            return this.postBuff(interaction, subCommand);
        } else {
            return this.postWeeksBuffs(interaction, subCommand);
        }
    }

    private postBuff(interaction: CommandInteraction, subCommand: string): Promise<void> {
        return this.buffManagerService.postBuff(interaction, subCommand);
    }

    private postWeeksBuffs(interaction: CommandInteraction, subCommand: string): Promise<void> {
        return this.buffManagerService.postWeeksBuffs(interaction, subCommand);
    }

    private postDailyMessage(client: Client): Promise<void> {
        return this.buffManagerService.postDailyMessage(client);
    }
}
