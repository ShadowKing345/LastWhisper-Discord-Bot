import { InteractionResponse, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { Timers } from "../utils/objects/timer.js";
import { authorize } from "../utils/decorators/authorize.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
import { DateTime } from "luxon";

/**
 * Module designed to deal with requests about buffs.
 * @see BuffManagerService
 */
@registerModule()
export class BuffManagerModule extends ModuleBase {
    @addPermissionKeys()
    public static permissionKeys = {
        buffs: "BuffManager.buffs",
        weeks: "BuffManager.weeks.thisWeek",
    };

    public moduleName = "BuffManager";
    public timers: Timers = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            execute: this.postDailyMessage.bind(this),
        },
    ];

    public commands: Commands = [
        new Command({
            name: "buff_manager",
            description: "Manages all things related to buffs",
            subcommands: {
                Buffs: new Command({
                    name: "buffs",
                    description: "Shows you what buffs are set.",
                    options: [
                        new CommandOption({
                            name: "tomorrow",
                            description: "Set to true if buff is for tomorrow.",
                            required: false,
                            type: ApplicationCommandOptionType.Boolean,
                        }),
                        new CommandOption({
                            name: "date",
                            description: "Get the buff for a specific date. Use ISO 8601 format.",
                            required: false,
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
                Weeks: new Command({
                    name: "weeks",
                    description: "Shows you what buffs for the week, are set to.",
                    options: [
                        new CommandOption({
                            name: "next_week",
                            description: "Set to true if buff is for tomorrow.",
                            required: false,
                            type: ApplicationCommandOptionType.Boolean,
                        }),
                        new CommandOption({
                            name: "date",
                            description: "Get the week for a specific date. Use ISO 8601 format.",
                            required: false,
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
            },
            execute: this.commandResolver.bind(this),
        }),
    ];

    protected commandResolverKeys = {
        "buff_manager.buffs": this.postBuff.bind(this),
        "buff_manager.weeks": this.postWeek.bind(this),
    };

    constructor(
        private buffManagerService: BuffManagerService,
        @createLogger(BuffManagerModule.name) logger: pino.Logger,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService, logger);
    }

    /**
     * Entry point for the buffs command.
     * Gets the relevant information to be passed to the service from the interaction.
     * @param interaction The interaction from Discord.
     * @private
     */
    @authorize(BuffManagerModule.permissionKeys.buffs)
    private postBuff(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        const tomorrow = interaction.options.getBoolean("tomorrow");
        const dateString = interaction.options.getString("date");

        let date: DateTime = DateTime.fromJSDate(interaction.createdAt);

        if (tomorrow) {
            date = date.plus({ day: 1 });
        } else if (dateString) {
            date = DateTime.fromISO(dateString);
        }

        return this.buffManagerService.postBuff(interaction, date);
    }

    /**
     * Entry point for the weeks command.
     * Gets the relevant information to be passed to the service from the interaction.
     * @param interaction The interaction from Discord.
     * @private
     */
    @authorize(BuffManagerModule.permissionKeys.weeks)
    private postWeek(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        return this.buffManagerService.postWeek(interaction, DateTime.fromJSDate(interaction.createdAt));
    }

    private postDailyMessage(client: Client): Promise<void> {
        return this.buffManagerService.postDailyMessage(client);
    }
}
