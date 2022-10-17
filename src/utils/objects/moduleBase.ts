import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListener } from "../models/index.js";
import { CommandBuilders } from "./commandBuilder.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { CommandResolverError } from "../errors/commandResolverError.js";
import { pino } from "pino";

/**
 * Base class for a module.
 */
export abstract class ModuleBase {
    public moduleName: string = "";
    public commands: CommandBuilders = [];
    public listeners: EventListener[] = [];
    public tasks: Task[] = [];

    public buttons: { [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void> };
    public selectMenus: { [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void> };
    public modalSubmits: { [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void> };

    protected commandResolverKeys: { [key: string]: Function } = {};

    protected constructor(
        public permissionManagerService: PermissionManagerService,
        protected logger: pino.Logger,
    ) {
    }

    /**
     * Method to resolve a slash command call from the discord client.
     * Will throw an error if the function was not found.
     * @param interaction Interaction object.
     * @param call Flag to set if the object should be called or just returned.
     * @throws Error
     * @protected
     */
    protected async commandResolver(interaction: ChatInputCommandInteraction, call: boolean = true): Promise<InteractionResponse | void | Function> {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);

        const command = [ interaction.commandName, interaction.options.getSubcommandGroup(), interaction.options.getSubcommand() ].filter(item => item).join(".");
        let f = this.commandResolverKeys[command];

        if (!f) {
            const error = new CommandResolverError("No command found with this name.");
            this.logger.error(error.stack);
            throw error;
        }
        f = f.bind(this);

        return call ? f(interaction) : f;
    }
}
