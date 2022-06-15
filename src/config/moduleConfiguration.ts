import chalk from "chalk";
import { CommandInteraction } from "discord.js";
import { pino } from "pino";
import { injectWithTransform, singleton } from "tsyringe";

import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { LoggerFactory, LoggerFactoryTransformer } from "../shared/logger.js";
import { Client } from "../shared/models/client.js";
import { BuildCommand, Command } from "../shared/models/command.js";
import { Listener } from "../shared/models/listener.js";
import { ModuleBase } from "../shared/models/moduleBase.js";

@singleton()
export class ModuleConfiguration extends ConfigurationClass {
    private static readonly loggerMeta = {
        moduleConfiguration: { context: "ModuleConfiguration" },
        interaction: { context: "InteractionInvoking" },
    };

    constructor(
        private buffManagerModule: BuffManagerModule,
        private eventManagerModule: EventManagerModule,
        private gardeningManagerModule: GardeningManagerModule,
        private managerUtilsModule: ManagerUtilsModule,
        private roleManagerModule: RoleManagerModule,
        private permissionManagerModule: PermissionManagerModule,
        @injectWithTransform(LoggerFactory, LoggerFactoryTransformer, ModuleConfiguration.name) private logger: pino.Logger,
    ) {
        super();
    }

    get modules(): ModuleBase[] {
        return [
            this.buffManagerModule,
            this.eventManagerModule,
            this.gardeningManagerModule,
            this.managerUtilsModule,
            this.roleManagerModule,
            this.permissionManagerModule,
        ];
    }

    async runEvent(listeners: Listener[], client: Client, ...args: any[]) {
        for (let i = 0; i < listeners.length; i++) {
            try {
                await listeners[i].run(client, ...args);
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error(error.stack, { context: "EventRunner" });
                }
            }
        }
    }

    configureModules(client: Client) {
        client.on("interactionCreate", async (interaction) => {
            this.logger.debug(chalk.magentaBright("Interaction Innovated"), ModuleConfiguration.loggerMeta.interaction);

            try {
                if (interaction.isButton()) {
                    this.logger.debug(chalk.magentaBright("Confirmed Button Interaction."), ModuleConfiguration.loggerMeta.interaction);
                    // todo: setup buttons.
                }

                if (interaction.isCommand()) {
                    this.logger.debug(chalk.magentaBright("Confirmed Command Interaction."), ModuleConfiguration.loggerMeta.interaction);
                    const command: Command = (interaction.client as Client).commands.get(interaction.commandName);
                    if (!command) {
                        this.logger.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`, ModuleConfiguration.loggerMeta.interaction);
                        return;
                    }

                    await command.run(interaction);
                }
            } catch (err) {
                if (interaction instanceof CommandInteraction && !interaction.replied) {
                    if (interaction.deferred) {
                        await interaction.editReply({
                            content: "There was an internal issue executing the command",
                        });
                    } else {
                        await interaction.reply({
                            content: "There was an internal issue executing the command",
                            ephemeral: true,
                        });
                    }
                }
                this.logger.error((err as Error).stack, ModuleConfiguration.loggerMeta.interaction);
            }
        });

        this.modules.forEach(module => {
            this.logger.info(`Setting up module ${chalk.blueBright(module.moduleName)}`, ModuleConfiguration.loggerMeta.moduleConfiguration);
            client.modules.set(module.moduleName, module);

            this.logger.debug(`Setting up ${chalk.cyan("commands")}...`, ModuleConfiguration.loggerMeta.moduleConfiguration);
            module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command as Command));

            this.logger.debug(`Setting up ${chalk.cyan("listeners")}...`, ModuleConfiguration.loggerMeta.moduleConfiguration);
            module.listeners.forEach(listener => {
                let listeners = client.moduleListeners.get(listener.event);
                if (!listeners) {
                    listeners = [];
                }
                listeners.push(listener);
                client.moduleListeners.set(listener.event, listeners);
            });

            this.logger.debug(`Setting up ${chalk.cyan("tasks")}...`, ModuleConfiguration.loggerMeta.moduleConfiguration);
            module.tasks.forEach(task => {
                client.tasks.set(task.name, task);
                setInterval(task.run, task.timeout, client);
                task.run(client).catch(err => console.error(err));
            });
        });

        this.logger.debug(`Setting up ${chalk.cyan("events")}...`, ModuleConfiguration.loggerMeta.moduleConfiguration);
        client.moduleListeners.forEach((listener, event) => {
            switch (event) {
                case "ready":
                    client.once(event, async (...args) => this.runEvent(listener, client, ...args));
                    break;
                default:
                    client.on(event, async (...args) => this.runEvent(listener, client, ...args));
                    break;
            }
        });
    }
}
