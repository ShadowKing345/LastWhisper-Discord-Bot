import fs from "fs";

import { ProjectConfiguration } from "../models/index.js";
import { toJson } from "../index.js";
import { container as defaultContainer, DependencyContainer } from "tsyringe";

export const configPath =
  process.env.CONFIG_PATH ?? "./config/ProjectConfiguration.json";
export const devConfigPath =
  process.env.DEV_CONFIG_PATH ?? "./config/ProjectConfiguration.dev.json";

/**
 * Parses the Json configuration file into a ProjectConfiguration Object.
 * @param path System path to config file.
 * @param devPath System path to dev config file.
 * @return New project configuration object.
 */
export function parseConfigFile(
  path: string,
  devPath?: string
): ProjectConfiguration {
  if (!path || !fs.existsSync(path)) return null;
  const config = toJson(
    new ProjectConfiguration(),
    fs.readFileSync(path, "utf-8")
  );

  if (!devPath || !fs.existsSync(devPath)) return config;
  return toJson(config, fs.readFileSync(devPath, "utf-8"));
}

/**
 * Generates and registers a configuration object.
 * @param container Dependency container to be used instead of the default one.
 */
export function generateConfigObject(
  container: DependencyContainer = defaultContainer
): void {
  if (!container.isRegistered(ProjectConfiguration)) {
    const config = parseConfigFile(configPath, devConfigPath);
    if (!config) {
      throw new Error("Configuration file was not created.");
    }

    container.register<ProjectConfiguration>(ProjectConfiguration, {
      useValue: config,
    });
  }
}
