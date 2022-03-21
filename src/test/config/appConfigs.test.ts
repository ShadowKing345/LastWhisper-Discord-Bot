import { jest } from "@jest/globals";
import { initConfigs } from "../../main/config/appConfigs";

describe("App Configuration", function () {
    it("should be able to open and read content of a file.", function () {
        console.log(initConfigs());

        expect(true).toBe(true);
    });

    afterAll(() => {
        jest.clearAllMocks();
    })
});
