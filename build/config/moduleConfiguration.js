var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "reflect-metadata";
import { container } from "tsyringe";
import { BuffManagerModule } from "../modules/buffManager.module.js";
import { BuildCommand } from "../classes/command.js";
import { EventManagerModule } from "../modules/eventManagerModule.js";
import { GardeningModule } from "../modules/gardening.module.js";
import { ManagerUtilsModule } from "../modules/managerUtilsModule.js";
import { RoleManagerModule } from "../modules/roleManagerModule.js";
import { logger } from "../utils/logger.js";
import chalk from "chalk";
const loggerMeta = {
    moduleConfiguration: { context: "ModuleConfiguration" },
    interaction: { context: "InteractionInvoking" }
};
export const loadedModules = [
    container.resolve(BuffManagerModule),
    container.resolve(EventManagerModule),
    container.resolve(GardeningModule),
    container.resolve(ManagerUtilsModule),
    container.resolve(RoleManagerModule)
];
function runEvent(listeners, client, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < listeners.length; i++) {
            try {
                yield listeners[i].run(client, ...args);
            }
            catch (error) {
                logger.error(error, { context: "EventRunner" });
            }
        }
    });
}
export function loadModules(client) {
    client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
        logger.debug(chalk.magentaBright("Interaction Innovated"), loggerMeta.interaction);
        try {
            if (interaction.isButton()) {
                logger.debug(chalk.magentaBright("Confirmed Button Interaction."), loggerMeta.interaction);
                // todo: setup buttons.
            }
            if (interaction.isCommand()) {
                logger.debug(chalk.magentaBright("Confirmed Command Interaction."), loggerMeta.interaction);
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    logger.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`, loggerMeta.interaction);
                    return;
                }
                yield command.run(interaction);
            }
        }
        catch (err) {
            yield interaction.reply({
                content: "There was an internal issue executing the command",
                ephemeral: true
            });
            logger.error(err, loggerMeta.interaction);
        }
    }));
    loadedModules.forEach(module => {
        logger.info(`Setting up module ${chalk.blueBright(module.moduleName)}`, loggerMeta.moduleConfiguration);
        client.modules.set(module.moduleName, module);
        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("commands")}...`, loggerMeta.moduleConfiguration);
        module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command));
        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("listeners")}...`, loggerMeta.moduleConfiguration);
        module.listeners.forEach(listener => {
            let listeners = client.moduleListeners.get(listener.event);
            if (!listeners) {
                listeners = [];
            }
            listeners.push(listener);
            client.moduleListeners.set(listener.event, listeners);
        });
        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("tasks")}...`, loggerMeta.moduleConfiguration);
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task);
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });
    logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("events")}...`, loggerMeta.moduleConfiguration);
    client.moduleListeners.forEach((listener, event) => {
        switch (event) {
            case "ready":
                client.once(event, (...args) => __awaiter(this, void 0, void 0, function* () { return runEvent(listener, client, ...args); }));
                break;
            default:
                client.on(event, (...args) => __awaiter(this, void 0, void 0, function* () { return runEvent(listener, client, ...args); }));
                break;
        }
    });
}
//# sourceMappingURL=moduleConfiguration.js.map