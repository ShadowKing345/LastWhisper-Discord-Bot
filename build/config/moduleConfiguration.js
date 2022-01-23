"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModules = exports.loadedModules = void 0;
const buffManagerModule_1 = require("../modules/buffManagerModule");
const builders_1 = require("@discordjs/builders");
const eventManagerModule_1 = require("../modules/eventManagerModule");
const gardeningModule_1 = require("../modules/gardeningModule");
const managerUtilsModule_1 = require("../modules/managerUtilsModule");
const roleManagerModule_1 = require("../modules/roleManagerModule");
const typedi_1 = require("typedi");
exports.loadedModules = [
    typedi_1.Container.get(buffManagerModule_1.BuffManagerModule),
    typedi_1.Container.get(eventManagerModule_1.EventManagerModule),
    typedi_1.Container.get(gardeningModule_1.GardeningModule),
    typedi_1.Container.get(managerUtilsModule_1.ManagerUtilsModule),
    typedi_1.Container.get(roleManagerModule_1.RoleManagerModule)
];
async function runEvent(listeners, client, ...args) {
    for (let i = 0; i < listeners.length; i++) {
        try {
            await listeners[i].run(client, ...args);
        }
        catch (e) {
            console.error(e);
        }
    }
}
function loadModules(client) {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isButton()) {
        }
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command)
                return;
            return command.run(interaction);
        }
    });
    exports.loadedModules.forEach(module => {
        console.debug("Setting up module", module.moduleName);
        client.modules.set(module.moduleName, module);
        console.debug("Setting up commands.");
        module.commands.forEach((command, index, array) => {
            if (typeof command.command === "function") {
                command.command = command.command(new builders_1.SlashCommandBuilder());
                array[index] = command;
            }
            client.commands.set(command.command.name, command);
        });
        console.debug("Setting up listeners.");
        module.listeners.forEach(listener => {
            let listeners = client.moduleListeners.get(listener.event);
            if (!listeners) {
                listeners = [];
            }
            listeners.push(listener);
            client.moduleListeners.set(listener.event, listeners);
        });
        console.debug("Setting up tasks.");
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task);
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });
    console.debug("Instantiating events.");
    client.moduleListeners.forEach((listener, event) => {
        switch (event) {
            case "ready":
                client.once(event, async (...args) => runEvent(listener, client, ...args));
                break;
            default:
                client.on(event, async (...args) => runEvent(listener, client, ...args));
                break;
        }
    });
}
exports.loadModules = loadModules;
