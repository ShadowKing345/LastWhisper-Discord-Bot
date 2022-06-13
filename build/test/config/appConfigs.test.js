import { test } from "tap";
import { AppConfigs } from "../../src/config/app_configs/index.js";
test("appConfigs.ts", t => {
    t.test("Config file parsing", t => {
        const dir = t.testdir({
            "./appConfigs.json": JSON.stringify(new AppConfigs()),
        });
        const result = AppConfigs.parseConfigFile(`${dir}/appConfigs.json`, `${dir}/appConfigs=dev.json`);
        t.ok(result);
        t.end();
    });
    t.end();
});
//# sourceMappingURL=appConfigs.test.js.map