import { ModuleService } from "../../config/index.js";
import { EventListener, Bot } from "../../objects/index.js";
import { CTR } from "../../utils/commonTypes.js";
import { Module } from "../../modules/module.js";
import { ClientEvents } from "discord.js";

/**
 * Decorator that attempts to register an event lister to the module service system.
 * Methods decorated with this command act as the executed method.
 * @param event The event name.
 */
export function Event<T extends Module, K extends keyof ClientEvents>(event: K) {
  return function(target: unknown, _: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    ModuleService.registerEventListener(new EventListener(
      event,
      descriptor.value as (client: Bot, args: ClientEvents[K]) => Promise<void>,
    ), target.constructor as CTR<T>);

    return descriptor;
  };
}