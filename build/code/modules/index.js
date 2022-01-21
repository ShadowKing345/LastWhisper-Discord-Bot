"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readModules = exports.Modules = exports.GardeningModule = exports.BuffModule = exports.ManagerUtilsModule = exports.RoleModule = exports.EventModule = void 0;
// region Module Export
const eventManager_1 = __importDefault(require("./eventManager"));
exports.EventModule = eventManager_1.default;
const roleManager_1 = __importDefault(require("./roleManager"));
exports.RoleModule = roleManager_1.default;
const managerUtils_1 = __importDefault(require("./managerUtils"));
exports.ManagerUtilsModule = managerUtils_1.default;
const buffManager_1 = __importDefault(require("./buffManager"));
exports.BuffModule = buffManager_1.default;
const gardeningModule_1 = __importDefault(require("./gardeningModule"));
exports.GardeningModule = gardeningModule_1.default;
const builders_1 = require("@discordjs/builders");
exports.Modules = [eventManager_1.default, roleManager_1.default, managerUtils_1.default, buffManager_1.default, new gardeningModule_1.default()];
// endregion
function readModules(callback) {
    for (let module of exports.Modules) {
        callback(module);
    }
}
exports.readModules = readModules;
async function runEvent(listeners, ...args) {
    for (let i = 0; i < listeners.length; i++) {
        try {
            await listeners[i].run(...args);
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.default = async (client) => {
    client.on("interactionCreate", (interaction) => {
        if (interaction.isButton()) {
            console.log(interaction.customId);
            interaction.reply({ content: "yolo", ephemeral: true });
        }
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command)
                return;
            command.run(interaction).catch(err => {
                console.error(err);
                return interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
            });
        }
    });
    readModules(module => {
        client.modules.set(module.name, module);
        module.commands.forEach((command, index, array) => {
            command.command = typeof command.command === "function" ? command.command(new builders_1.SlashCommandBuilder()) : command.command;
            array[index] = command;
            client.commands.set(command.command.name, command);
        });
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task);
            setInterval(task.run, task.timeout, client);
            task.run(client);
        });
        module.listeners.forEach(listener => {
            let collection = client.moduleListeners.get(listener.event) ?? [];
            collection.push(listener);
            client.moduleListeners.set(listener.event, collection);
        });
    });
    client.moduleListeners.forEach((listener, event) => {
        switch (event) {
            case "ready":
                client.once(event, async () => runEvent(listener, client));
                break;
            default:
                client.on(event, async (...args) => runEvent(listener, ...args));
                break;
        }
    });
};
