import { test } from "tap";

import { AppConfigs, parseConfigFile } from "../../src/config/appConfigs.js";

test("appConfigs.ts", t => {
    t.test("Config file parsing", t => {
        const dir = t.testdir({
            "./appConfigs.json": JSON.stringify(new AppConfigs()),
        });

        const result = parseConfigFile(`${dir}/appConfigs.json`, `${dir}/appConfigs=dev.json`);
        t.ok(result);
        t.end();
    });
    t.end();
});