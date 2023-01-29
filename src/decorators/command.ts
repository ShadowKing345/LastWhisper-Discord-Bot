import { ModuleService } from "../config/index.js";
import { SlashCommand } from "../objects/index.js";
import { ChatInputCommandInteraction } from "discord.js";
import { CTR } from "../utils/commonTypes.js";
import { Module } from "../modules/module.js";

/**
 * Decorator that attempts to register commands to the module service system.
 * Methods decorated with this command act as the executed method.
 */
export function Command<T extends Module>(command: Partial<Omit<SlashCommand, "callback">>) {
  return function(target: unknown, _: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    ModuleService.registerCommand(new SlashCommand({
      name: command.name,
      description: command.description,
      callback: descriptor.value as (interaction: ChatInputCommandInteraction) => Promise<unknown>,
      subcommands: command.subcommands,
      options: command.options,
    }), target.constructor as CTR<T>);

    return descriptor;
  };
}