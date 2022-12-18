import { container as globalContainer, DependencyContainer } from "tsyringe";
import fs from "fs";
import { flattenObject, deepMerge } from "../utils/index.js";
import { ProjectConfiguration } from "../utils/objects/index.js";

/**
 * A Service class used to register configuration objects into the dependency tree.
 */
export class ConfigurationService {
  public static readonly configPath = process.env.CONFIG_PATH ?? "./config/default.json";
  public static readonly devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/development.json";
  private static flattenConfigs: Map<string, unknown> = new Map<string, unknown>();

  /**
   * Registers a config object with a key to a container.
   * @param key The key for the config file.
   * @param entity A constructor function to create an object from.
   * @param container Override for the global container.
   * @throws A bad configuration error when the key cannot be found.
   * @constructor
   */
  public static RegisterConfiguration<T extends object>(key: string, entity: { new(): T }, container: DependencyContainer = globalContainer): void {
    if (ConfigurationService.flattenConfigs.size < 1) {
      this.createConfigMap();
    }

    const map = ConfigurationService.flattenConfigs;

    if (!map.has(key)) {
      throw new Error(`Configuration file has no config with the key ${key}`);
    }

    const e = deepMerge(new entity(), map.get(key));

    container.register(entity, { useValue: e });
  }

  /**
   * Creates a configuration map to be used for each configuration service.
   * This method also clear whatever is currently stored.
   * @private
   */
  private static createConfigMap(): void {
    ConfigurationService.flattenConfigs.clear();

    const config = ConfigurationService.parseConfigs();

    for (const [ key, value ] of Object.entries(flattenObject(config, true))) {
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

  private static parseConfigFile(path: string): ProjectConfiguration {
    const objStr: string = ConfigurationService.readFile(path);

    if (!objStr) {
      return null;
    }

    return deepMerge(ProjectConfiguration, JSON.parse(objStr));
  }

  /**
   * Returns a ProjectConfiguration object.
   * This function also merges the relevant config file for each environment.
   * @private
   */
  private static parseConfigs(): ProjectConfiguration {
    const config = ConfigurationService.parseConfigFile(ConfigurationService.configPath);

    if (process.env.NODE_ENV !== "development") {
      return config ?? new ProjectConfiguration();
    }

    const devConfig = ConfigurationService.parseConfigFile(ConfigurationService.devConfigPath);
    return devConfig ? deepMerge(config, devConfig) : config;
  }
}
