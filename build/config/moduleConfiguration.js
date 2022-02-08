var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BuffManagerModule } from "../modules/buffManagerModule.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EventManagerModule } from "../modules/eventManagerModule.js";
import { GardeningModule } from "../modules/gardeningModule.js";
import { ManagerUtilsModule } from "../modules/managerUtilsModule.js";
import { RoleManagerModule } from "../modules/roleManagerModule.js";
import { logger } from "../utils/logger.js";
import chalk from "chalk";
export const loadedModules = [
    new BuffManagerModule(),
    new EventManagerModule(),
    new GardeningModule(),
    new ManagerUtilsModule(),
    new RoleManagerModule()
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
        try {
            if (interaction.isButton()) {
                // todo: setup buttons.
            }
            if (interaction.isCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command)
                    return;
                yield command.run(interaction);
            }
        }
        catch (error) {
            yield interaction.reply({
                content: "There was an internal issue executing the command",
                ephemeral: true
            });
            logger.error(error, { context: "InteractionInvoking" });
        }
    }));
    loadedModules.forEach(module => {
        logger.info(`Setting up module ${chalk.red(module.moduleName)}`, { context: "ModuleConfiguration" });
        client.modules.set(module.moduleName, module);
        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("commands")}...`, { context: "ModuleConfiguration" });
        module.commands.forEach((command, index, array) => {
            if (typeof command.command === "function") {
                command.command = command.command(new SlashCommandBuilder());
                array[index] = command;
            }
            client.commands.set(command.command.name, command);
        });
        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("listeners")}...`, { context: "ModuleConfiguration" });
        module.listeners.forEach(listener => {
            let listeners = client.moduleListeners.get(listener.event);
            if (!listeners) {
                listeners = [];
            }
            listeners.push(listener);
            client.moduleListeners.set(listener.event, listeners);
        });
        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("tasks")}...`, { context: "ModuleConfiguration" });
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task);
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });
    logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("events")}...`, { context: "ModuleConfiguration" });
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