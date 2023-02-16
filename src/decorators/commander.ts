import { Command, CommandOptions, HookEvent, Option, program as gloProgram } from "commander";
import { isArray } from "../utils/index.js";

export class Commander {
  public static addCommand<T>(obj: Partial<CommandOpts> | Command, program: Command = gloProgram) {
    return function(target: T, _: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
      let command: Command;

      if (obj instanceof Command) {
        command = program.addCommand(obj);
      } else {
        command = program
          .command(obj.name, obj.opts)
          .description(obj.description);

        if ("argument" in obj && isArray(obj.argument)) {
          command.argument(obj.argument[0], obj.argument[1], obj.argument[2]);
        }

        if (obj.options && isArray(obj.options)) {
          for (const opt of obj.options) {
            if (opt instanceof Option) {
              command.addOption(opt);
            } else {
              command.option(opt.definition, opt.description);
            }
          }
        }
      }

      command.action((descriptor.value as (...args: unknown[]) => void | Promise<void>).bind(target));

      return descriptor;
    };
  }

  public static hook<T>(event: HookEvent, program: Command = gloProgram) {
    return function(target: T, _, descriptor: PropertyDescriptor): PropertyDescriptor {
      program.hook(event, (descriptor.value as (command: Command, actionCommand: Command) => void | Promise<void>).bind(target));

      return descriptor;
    };
  }
}

export class CommandOpts {
  name: string;
  description: string;
  argument: [string, string?, string?];
  opts?: CommandOptions;
  options?: Array<{ definition: string, description: string } | Option> = [];
}