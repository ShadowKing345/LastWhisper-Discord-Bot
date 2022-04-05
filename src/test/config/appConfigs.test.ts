import { jest } from "@jest/globals";
import { vol } from "memfs";

import { AppConfigs, DatabaseConfiguration, parseConfigFile } from "../../main/config/appConfigs";

jest.mock("fs");

const config: AppConfigs = new AppConfigs();
config.token = "Fish";
config.database = new DatabaseConfiguration();

describe("App Configuration", () => {
    beforeEach(() => vol.reset());

    it("should be able to parse an existing file", () => {
        vol.fromJSON({
            "./appConfigs.json": JSON.stringify(config),
        });
        expect(parseConfigFile()).toEqual(config);
    });

    it("should return null if no file was found", () => {
        expect(parseConfigFile()).not.toBeTruthy();
    });

    afterAll(() => {
        vol.reset();
        jest.clearAllMocks();
    });
});

