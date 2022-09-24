import { ProjectConfiguration } from "../models/index.js";
import { DependencyContainer } from "tsyringe";
export declare const configPath: string;
export declare const devConfigPath: string;
/**
 * Parses the Json configuration file into a ProjectConfiguration Object.
 * @param path System path to config file.
 * @param devPath System path to dev config file.
 * @return New project configuration object.
 */
export declare function parseConfigFile(path: string, devPath?: string): ProjectConfiguration;
/**
 * Generates and registers a configuration object.
 * @param container Dependency container to be used instead of the default one.
 */
export declare function generateConfigObject(container?: DependencyContainer): void;
//# sourceMappingURL=appConfigs.d.ts.map