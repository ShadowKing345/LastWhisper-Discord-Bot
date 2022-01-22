import {Client} from "../classes/client";
import {BuffManagerModule} from "../modules/buffManagerModule";
import {ModuleBase} from "../classes/moduleBase";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Command} from "../classes/command";
import {Listener} from "../classes/listener";
import {EventManagerModule} from "../modules/eventManagerModule";
import {GardeningModule} from "../modules/gardeningModule";
import {ManagerUtilsModule} from "../modules/managerUtilsModule";
import {RoleManagerModule} from "../modules/roleManagerModule";

export const loadedModules: ModuleBase[] = [
    new BuffManagerModule(),
    new EventManagerModule(),
    new GardeningModule(),
    new ManagerUtilsModule(),
    new RoleManagerModule()
];

async function runEvent(listeners: Listener[], ...args) {
    for (let i = 0; i < listeners.length; i++) {
        try {
            await listeners[i].run(...args);
        } catch (e) {
            console.error(e);
        }
    }
}

export function loadModules(client: Client) {
    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {

        }

        if (interaction.isCommand()) {
            const command: Command = (interaction.client as Client).commands.get(interaction.commandName);
            if (!command) return;

            return command.run(interaction);
        }
    });

    loadedModules.forEach(module => {
        console.debug("Setting up module", module.moduleName);
        client.modules.set(module.moduleName, module);

        console.debug("Setting up commands.");
        module.commands.forEach((command, index, array) => {
            if (typeof command.command === "function") {
                command.command = command.command(new SlashCommandBuilder());
                array[index] = command;
            }
            client.commands.set((command.command as SlashCommandBuilder).name, command);
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
            client.tasks.set(task.name, task)
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });

    console.debug("Instantiating events.")
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