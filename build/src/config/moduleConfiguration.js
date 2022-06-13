var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ModuleConfiguration_1;
import chalk from "chalk";
import { singleton } from "tsyringe";
import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { buildLogger } from "../shared/logger.js";
import { BuildCommand } from "../shared/models/command.js";
let ModuleConfiguration = ModuleConfiguration_1 = class ModuleConfiguration extends ConfigurationClass {
    buffManagerModule;
    eventManagerModule;
    gardeningManagerModule;
    managerUtilsModule;
    roleManagerModule;
    permissionManagerModule;
    logger = buildLogger("ModuleConfiguration");
    static loggerMeta = {
        moduleConfiguration: { context: "ModuleConfiguration" },
        interaction: { context: "InteractionInvoking" },
    };
    constructor(buffManagerModule, eventManagerModule, gardeningManagerModule, managerUtilsModule, roleManagerModule, permissionManagerModule) {
        super();
        this.buffManagerModule = buffManagerModule;
        this.eventManagerModule = eventManagerModule;
        this.gardeningManagerModule = gardeningManagerModule;
        this.managerUtilsModule = managerUtilsModule;
        this.roleManagerModule = roleManagerModule;
        this.permissionManagerModule = permissionManagerModule;
    }
    get modules() {
        return [
            this.buffManagerModule,
            this.eventManagerModule,
            this.gardeningManagerModule,
            this.managerUtilsModule,
            this.roleManagerModule,
            this.permissionManagerModule,
        ];
    }
    async runEvent(listeners, client, ...args) {
        for (let i = 0; i < listeners.length; i++) {
            try {
                await listeners[i].run(client, ...args);
            }
            catch (error) {
                if (error instanceof Error) {
                    this.logger.error(error.stack, { context: "EventRunner" });
                }
            }
        }
    }
    configureModules(client) {
        client.on("interactionCreate", async (interaction) => {
            this.logger.debug(chalk.magentaBright("Interaction Innovated"), ModuleConfiguration_1.loggerMeta.interaction);
            try {
                if (interaction.isButton()) {
                    this.logger.debug(chalk.magentaBright("Confirmed Button Interaction."), ModuleConfiguration_1.loggerMeta.interaction);
                    // todo: setup buttons.
                }
                if (interaction.isCommand()) {
                    this.logger.debug(chalk.magentaBright("Confirmed Command Interaction."), ModuleConfiguration_1.loggerMeta.interaction);
                    const command = interaction.client.commands.get(interaction.commandName);
                    if (!command) {
                        this.logger.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`, ModuleConfiguration_1.loggerMeta.interaction);
                        return;
                    }
                    await command.run(interaction);
                }
            }
            catch (err) {
                await interaction.reply({
                    content: "There was an internal issue executing the command",
                    ephemeral: true,
                });
                this.logger.error(err.stack, ModuleConfiguration_1.loggerMeta.interaction);
            }
        });
        this.modules.forEach(module => {
            this.logger.info(`Setting up module ${chalk.blueBright(module.moduleName)}`, ModuleConfiguration_1.loggerMeta.moduleConfiguration);
            client.modules.set(module.moduleName, module);
            this.logger.debug(`Setting up ${chalk.cyan("commands")}...`, ModuleConfiguration_1.loggerMeta.moduleConfiguration);
            module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command));
            this.logger.debug(`Setting up ${chalk.cyan("listeners")}...`, ModuleConfiguration_1.loggerMeta.moduleConfiguration);
            module.listeners.forEach(listener => {
                let listeners = client.moduleListeners.get(listener.event);
                if (!listeners) {
                    listeners = [];
                }
                listeners.push(listener);
                client.moduleListeners.set(listener.event, listeners);
            });
            this.logger.debug(`Setting up ${chalk.cyan("tasks")}...`, ModuleConfiguration_1.loggerMeta.moduleConfiguration);
            module.tasks.forEach(task => {
                client.tasks.set(task.name, task);
                setInterval(task.run, task.timeout, client);
                task.run(client).catch(err => console.error(err));
            });
        });
        this.logger.debug(`Setting up ${chalk.cyan("events")}...`, ModuleConfiguration_1.loggerMeta.moduleConfiguration);
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
};
ModuleConfiguration = ModuleConfiguration_1 = __decorate([
    singleton(),
    __metadata("design:paramtypes", [BuffManagerModule,
        EventManagerModule,
        GardeningManagerModule,
        ManagerUtilsModule,
        RoleManagerModule,
        PermissionManagerModule])
], ModuleConfiguration);
export { ModuleConfiguration };
//# sourceMappingURL=moduleConfiguration.js.map