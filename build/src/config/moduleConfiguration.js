var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import chalk from "chalk";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import { clearInterval } from "timers";
import { singleton } from "tsyringe";
import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { LoggerFactory } from "../shared/logger.js";
import { BuildCommand } from "../shared/models/command.js";
let ModuleConfiguration = class ModuleConfiguration extends ConfigurationClass {
    intervalIds = [];
    _modules;
    loggers;
    constructor(buffManagerModule, eventManagerModule, gardeningManagerModule, managerUtilsModule, roleManagerModule, permissionManagerModule, loggerFactory) {
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
    async interactionEvent(interaction) {
        this.loggers.module.debug(chalk.magentaBright("Interaction Innovated"));
        try {
            if (interaction.isButton()) {
                this.loggers.module.debug(chalk.magentaBright("Confirmed Button Interaction."));
                // todo: setup buttons.
            }
            if (interaction.isCommand()) {
                this.loggers.module.debug(chalk.magentaBright("Confirmed Command Interaction."));
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    this.loggers.module.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`);
                    return;
                }
                await command.run(interaction);
            }
        }
        catch (error) {
            this.loggers.interaction.error(error instanceof Error ? error + error.stack : error);
            if (interaction && (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) && !interaction.replied) {
                if (interaction.deferred) {
                    await interaction.editReply({ content: "There was an internal error that occurred when using this interaction." });
                }
                else {
                    await interaction.reply({
                        content: "There was an internal error that occurred when using this interaction.",
                        ephemeral: true,
                    });
                }
            }
        }
    }
    async runEvent(listeners, client, ...args) {
        for (let i = 0; i < listeners.length; i++) {
            try {
                await listeners[i].run(client, ...args);
            }
            catch (error) {
                this.loggers.event.error(error instanceof Error ? error + error.stack : error);
            }
        }
    }
    async runTask(task, client) {
        try {
            client.tasks.set(task.name, task);
            this.intervalIds.push(setInterval(async () => {
                try {
                    await task.run(client);
                }
                catch (error) {
                    this.loggers.task.error(error instanceof Error ? error + error.stack : error);
                }
            }, task.timeout, client));
            await task.run(client);
        }
        catch (error) {
            this.loggers.task.error(error instanceof Error ? error + error.stack : error);
        }
    }
    configureModules(client) {
        this.loggers.module.info("Loading modules.");
        for (const module of this.modules) {
            try {
                this.loggers.module.info(`Setting up module ${chalk.blueBright(module.moduleName)}`);
                client.modules.set(module.moduleName, module);
                this.loggers.module.debug(`Setting up ${chalk.cyan("commands")}...`);
                module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command));
                this.loggers.module.debug(`Setting up ${chalk.cyan("listeners")}...`);
                module.listeners.forEach(listener => {
                    const listeners = client.moduleListeners.get(listener.event) ?? [];
                    listeners.push(listener);
                    client.moduleListeners.set(listener.event, listeners);
                });
                this.loggers.module.debug(`Setting up ${chalk.cyan("tasks")}...`);
                module.tasks.forEach(task => this.runTask(task, client));
            }
            catch (error) {
                this.loggers.module.error(error instanceof Error ? error + error.stack : error);
            }
        }
        this.loggers.module.debug(`Setting up ${chalk.cyan("events")}...`);
        client.moduleListeners.forEach((listener, event) => client.on(event, async (...args) => this.runEvent(listener, client, ...args)));
        this.loggers.module.debug(`Setting up ${chalk.cyan("interaction event")}...`);
        client.on("interactionCreate", interaction => this.interactionEvent(interaction));
    }
    cleanup() {
        this.loggers.module.info("Cleaning up module configurations.");
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }
    get modules() {
        return this._modules;
    }
};
ModuleConfiguration = __decorate([
    singleton(),
    __metadata("design:paramtypes", [BuffManagerModule,
        EventManagerModule,
        GardeningManagerModule,
        ManagerUtilsModule,
        RoleManagerModule,
        PermissionManagerModule,
        LoggerFactory])
], ModuleConfiguration);
export { ModuleConfiguration };
//# sourceMappingURL=moduleConfiguration.js.map