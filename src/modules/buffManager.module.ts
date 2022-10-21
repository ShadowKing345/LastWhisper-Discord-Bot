import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Commands, Command } from "../utils/objects/command.js";
import { Task } from "../utils/objects/task.js";

@registerModule()
export class BuffManagerModule extends ModuleBase {
    public moduleName: string = "BuffManager";
    public tasks: Task[] = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            run: async client => this.postDailyMessage(client),
        },
    ];

    public commands: Commands = [
        new Command({
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
            execute: interaction => this.commandResolver(interaction),
        }),
    ];

    protected commandResolverKeys: { [key: string]: Function } = {
        "buff_manager.buffs.today": this.postTodayBuff,
        "buff_manager.buffs.tomorrow": this.postTomorrowsBuff,
        "buff_manager.weeks.this_week": this.postThisWeeksBuffs,
        "buff_manager.weeks.next_week": this.postNextWeeksBuffs,
    };

    constructor(
        private buffManagerService: BuffManagerService,
        @createLogger(BuffManagerModule.name) logger: pino.Logger,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService, logger);
    }

    private postTodayBuff(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.buffManagerService.postBuff(interaction);
    }

    private postTomorrowsBuff(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.buffManagerService.postBuff(interaction, false);
    }

    private postThisWeeksBuffs(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.buffManagerService.postWeeksBuffs(interaction);
    }

    private postNextWeeksBuffs(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.buffManagerService.postWeeksBuffs(interaction, false);
    }

    private postDailyMessage(client: Client): Promise<void> {
        return this.buffManagerService.postDailyMessage(client);
    }
}
