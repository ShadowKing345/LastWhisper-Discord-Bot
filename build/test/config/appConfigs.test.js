import "reflect-metadata";
import { test } from "tap";
import { AppConfig, configPath, devConfigPath, parseConfigFile } from "../../src/config/app_configs/index.js";
test("appConfigs.ts", t => {
    t.test("Config file parsing.", t => {
        const dir = t.testdir({
            [`${configPath}`]: JSON.stringify(new AppConfig()),
        });
        const result = parseConfigFile(`${dir}/${configPath}`, `${dir}/${devConfigPath}`);
        t.ok(result);
        t.end();
    });
    t.test("Dev config file parsing.", t => {
        const config = new AppConfig();
        config.token = "config";
        const devConfig = new AppConfig();
        devConfig.token = "devConfig";
        const dir = t.testdir({
            [`${configPath}`]: JSON.stringify(config),
            [`${devConfigPath}`]: JSON.stringify(devConfig),
        });
        const result = parseConfigFile(`${dir}/${configPath}`, `${dir}/${devConfigPath}`);
        t.equal(result.token, "devConfig");
        t.end();
    });
    t.test("Returns null when file not found.", t => {
        const dir = t.testdir({});
        t.notOk(parseConfigFile(`${dir}/${configPath}`));
        t.end();
    });
    t.end();
});
//# sourceMappingURL=appConfigs.test.js.map