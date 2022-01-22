"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModules = exports.loadedModules = void 0;
const buffManagerModule_1 = require("../modules/buffManagerModule");
const builders_1 = require("@discordjs/builders");
const eventManagerModule_1 = require("../modules/eventManagerModule");
const gardeningModule_1 = require("../modules/gardeningModule");
const managerUtilsModule_1 = require("../modules/managerUtilsModule");
const roleManagerModule_1 = require("../modules/roleManagerModule");
exports.loadedModules = [
    new buffManagerModule_1.BuffManagerModule(),
    new eventManagerModule_1.EventManagerModule(),
    new gardeningModule_1.GardeningModule(),
    new managerUtilsModule_1.ManagerUtilsModule(),
    new roleManagerModule_1.RoleManagerModule()
];
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
                client.once(event, async () => runEvent(listener, client));
                break;
            default:
                client.on(event, async () => runEvent(listener, client));
                break;
        }
    });
}
exports.loadModules = loadModules;
