import fs from "fs";
import { container as globalContainer, DependencyContainer } from "tsyringe";
import { deepMerge, flattenObject } from "../utils/index.js";
import { ApplicationConfiguration } from "./entities/index.js";

/**
 * A Service class used to register configuration objects into the dependency tree.
 */
export class ConfigurationService {
  public static readonly configPath = process.env.CONFIG_PATH ?? "./config/common.json";
  public static readonly devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/development.json";
  private static flattenConfigs: Map<string, unknown> = new Map<string, unknown>();

  /**
   * Registers a config object with a key to a container.
   * @param key The key for the config file.
   * @param entity A constructor function to create an object from.
   * @param container Override for the global container.
   * @throws A bad configuration error when the key cannot be found.
   */
  public static registerConfiguration<T extends object>(key: string, entity: { new(): T } = null, container: DependencyContainer = globalContainer): void {
    if (ConfigurationService.flattenConfigs.size < 1) {
      this.createConfigMap();
    }

    const map = ConfigurationService.flattenConfigs;

    if (!map.has(key)) {
      throw new Error(`Configuration file has no config with the key ${key}`);
    }

    if (entity) {
      const e = deepMerge(new entity(), map.get(key));
      container.register(entity, { useValue: e });
    } else {
      container.register(key, { useValue: map.get(key) as T });
    }
  }

  /**
   * Attempts to return a parse configuration object.
   * Throws if none can be found.
   * @param key The key in the configuration file.
   * @param entity The object to be mapped to.
   */
  public static getConfiguration<T>(key: string, entity: { new(): T } = null): T {
    if (ConfigurationService.flattenConfigs.size < 1) {
      this.createConfigMap();
    }

    const map = ConfigurationService.flattenConfigs;

    if (!map.has(key)) {
      throw new Error(`Configuration file has no config with the key ${key}`);
    }

    return entity ? deepMerge(new entity(), map.get(key)) : map.get(key) as T;
  }

  /**
   * Creates a configuration map to be used for each configuration service.
   * This method also clear whatever is currently stored.
   * @private
   */
  private static createConfigMap(): void {
    ConfigurationService.flattenConfigs.clear();

    const config = ConfigurationService.parseConfigs();

    for (const [key, value] of Object.entries(flattenObject(config as object, true))) {
      ConfigurationService.flattenConfigs.set(key, value);
    }

    ConfigurationService.flattenConfigs.set("", config);
  }

  /**
   * Attempts to read a file and return its string content.
   * @param path The path to the file.
   * @return The string content or null if it cannot be found.
   * @private
   */

  private static readFile(path: string): string {
    if (!(path && fs.existsSync(path))) {
      return null;
    }

    return fs.readFileSync(path, "utf-8");
  }

  /**
   * Creates a configuration object given a path.
   * Only works with JSON objects.
   * @param path The file path of the configuration.
   * @return A ProjectConfiguration object or null.
   * @private
   */

  private static parseConfigFile(path: string): ApplicationConfiguration {
    const objStr: string = ConfigurationService.readFile(path);

    if (!objStr) {
      return null;
    }

    return deepMerge(ApplicationConfiguration, JSON.parse(objStr));
  }

  /**
   * Returns a ProjectConfiguration object.
   * This function also merges the relevant config file for each environment.
   * @private
   */
  private static parseConfigs(): ApplicationConfiguration {
    const config = ConfigurationService.parseConfigFile(ConfigurationService.configPath);

    if (process.env.NODE_ENV !== "development") {
      return config ?? new ApplicationConfiguration();
    }

    const devConfig = ConfigurationService.parseConfigFile(ConfigurationService.devConfigPath);
    return devConfig ? deepMerge(config, devConfig) : config;
  }
}
