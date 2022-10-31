import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Commands, Command } from "../utils/objects/command.js";
import { Timers } from "../utils/objects/timer.js";
import { authorize } from "../utils/decorators/authorize.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";

@registerModule()
export class BuffManagerModule extends ModuleBase {
    @addPermissionKeys()
    public static permissionKeys = {
        buffs: {
            today: "BuffManager.buffs.today",
            tomorrow: "BuffManager.buffs.tomorrow",
        },
        weeks: {
            thisWeek: "BuffManager.weeks.thisWeek",
            nextWeek: "BuffManager.weeks.nextWeek",
        }
    }

    public moduleName = "BuffManager";
    public timers: Timers = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            execute: async client => this.postDailyMessage(client),
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
                    subcommands: {
                        Today: new Command({
                            name: "today",
                            description: "Gets today's buff.",
                        }),
                        Tomorrow: new Command({
                            name: "tomorrow",
                            description: "Gets tomorrow's buff.",
                        }),
                    },
                }),
                Weeks: new Command({
                    name: "weeks",
                    description: "Shows you what buffs for the week, are set to.",
                    subcommands: {
                        ThisWeek: new Command({
                            name: "this_week",
                            description: "Gets this week's buffs.",
                        }),
                        NextWeek: new Command({
                            name: "next_week",
                            description: "Gets next week's buffs",
                        }),
                    },
                }),
            },
            execute: interaction => this.commandResolver(interaction) as Promise<InteractionResponse | void>,
        }),
    ];

    protected commandResolverKeys = {
        "buff_manager.buffs.today": this.postTodayBuff.bind(this),
        "buff_manager.buffs.tomorrow": this.postTomorrowsBuff.bind(this),
        "buff_manager.weeks.this_week": this.postThisWeeksBuffs.bind(this),
        "buff_manager.weeks.next_week": this.postNextWeeksBuffs.bind(this),
    };

    constructor(
        private buffManagerService: BuffManagerService,
        @createLogger(BuffManagerModule.name) logger: pino.Logger,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService, logger);
    }

    @authorize(BuffManagerModule.permissionKeys.buffs.today)
    private postTodayBuff(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        return this.buffManagerService.postBuff(interaction);
    }

    @authorize(BuffManagerModule.permissionKeys.buffs.tomorrow)
    private postTomorrowsBuff(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        return this.buffManagerService.postBuff(interaction, false);
    }

    @authorize(BuffManagerModule.permissionKeys.weeks.thisWeek)
    private postThisWeeksBuffs(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        return this.buffManagerService.postWeeksBuffs(interaction);
    }

    @authorize(BuffManagerModule.permissionKeys.weeks.nextWeek)
    private postNextWeeksBuffs(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        return this.buffManagerService.postWeeksBuffs(interaction, false);
    }

    private postDailyMessage(client: Client): Promise<void> {
        return this.buffManagerService.postDailyMessage(client);
    }
}
