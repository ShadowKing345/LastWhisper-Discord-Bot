import chalk from "chalk";
import { ButtonInteraction, CommandInteraction, Interaction } from "discord.js";
import { pino } from "pino";
import { clearInterval } from "timers";
import { singleton } from "tsyringe";

import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { LoggerFactory } from "../shared/logger/logger.js";
import { Client } from "../shared/models/client.js";
import { BuildCommand, Command } from "../shared/models/command.js";
import { Listener } from "../shared/models/listener.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { Task } from "../shared/models/task.js";

const settingUp = "Setting up";

@singleton()
export class ModuleConfiguration extends ConfigurationClass {
    private readonly intervalIds: number[] = [];
    private readonly _modules: ModuleBase[];
    private readonly loggers: { module: pino.Logger, interaction: pino.Logger, event: pino.Logger, task: pino.Logger };

    constructor(
        buffManagerModule: BuffManagerModule,
        eventManagerModule: EventManagerModule,
        gardeningManagerModule: GardeningManagerModule,
        managerUtilsModule: ManagerUtilsModule,
        roleManagerModule: RoleManagerModule,
        permissionManagerModule: PermissionManagerModule,
        loggerFactory: LoggerFactory,
    ) {
        super();
        this.loggers = {
            module: loggerFactory.buildLogger("ModuleConfiguration"),
            interaction: loggerFactory.buildLogger("InteractionExecution"),
            event: loggerFactory.buildLogger("EventExecution"),
            task: loggerFactory.buildLogger("TimerExecution"),
        };
        this._modules = [
            buffManagerModule,
            eventManagerModule,
            gardeningManagerModule,
            managerUtilsModule,
            roleManagerModule,
            permissionManagerModule,
        ];
    }

    private async interactionEvent(interaction: Interaction): Promise<void> {
        this.loggers.module.debug(chalk.magentaBright("Interaction Innovated"));

        try {
            if (interaction.isButton()) {
                this.loggers.module.debug(chalk.magentaBright("Confirmed Button Interaction."));
                // todo: setup buttons.
            }

            if (interaction.isCommand()) {
                this.loggers.module.debug(chalk.magentaBright("Confirmed Command Interaction."));
                const command: Command = (interaction.client as Client).commands.get(interaction.commandName);
                if (!command) {
                    this.loggers.module.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`);
                    return;
                }

                await command.run(interaction);
            }
        } catch (error: Error | unknown) {
            this.loggers.interaction.error(error instanceof Error ? error + error.stack : error);

            if (interaction && (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) && !interaction.replied) {
                if (interaction.deferred) {
                    await interaction.editReply({ content: "There was an internal error that occurred when using this interaction." });
                } else {
                    await interaction.reply({
                        content: "There was an internal error that occurred when using this interaction.",
                        ephemeral: true,
                    });
                }
            }
        }
    }

    private async runEvent(listeners: Listener[], client: Client, ...args: any[]): Promise<void> {
        for (let i = 0; i < listeners.length; i++) {
            try {
                await listeners[i].run(client, ...args);
            } catch (error: Error | unknown) {
                this.loggers.event.error(error instanceof Error ? error + error.stack : error);
            }
        }
    }

    private async runTask(task: Task, client: Client): Promise<void> {
        try {
            client.tasks.set(task.name, task);
            this.intervalIds.push(setInterval(async () => {
                try {
                    await task.run(client);
                } catch (error: Error | unknown) {
                    this.loggers.task.error(error instanceof Error ? error + error.stack : error);
                }
            }, task.timeout, client));
            await task.run(client);
        } catch (error: Error | unknown) {
            this.loggers.task.error(error instanceof Error ? error + error.stack : error);
        }
    }

    public configureModules(client: Client): void {
        this.loggers.module.info("Loading modules.");
        for (const module of this.modules) {
            try {
                this.loggers.module.info(`${settingUp} module ${module.moduleName}`);
                client.modules.set(module.moduleName, module);

                this.loggers.module.debug(`${settingUp} commands...`);
                module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command as Command));

                this.loggers.module.debug(`${settingUp} listeners...`);
                module.listeners.forEach(listener => {
                    const listeners = client.moduleListeners.get(listener.event) ?? [];
                    listeners.push(listener);
                    client.moduleListeners.set(listener.event, listeners);
                });

                this.loggers.module.debug(`${settingUp} tasks...`);
                module.tasks.forEach(task => this.runTask(task, client));
            } catch (error: Error | unknown) {
                this.loggers.module.error(error instanceof Error ? error + error.stack : error);
            }
        }

        this.loggers.module.debug(`${settingUp} events...`);
        client.moduleListeners.forEach((listener, event) => client.on(event, async (...args) => this.runEvent(listener, client, ...args)));

        this.loggers.module.debug(`${settingUp} interaction event...`);
        client.on("interactionCreate", interaction => this.interactionEvent(interaction));
    }

    public cleanup() {
        this.loggers.module.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }

    public get modules(): ModuleBase[] {
        return this._modules;
    }
}
