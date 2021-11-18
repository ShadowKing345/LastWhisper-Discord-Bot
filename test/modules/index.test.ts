import {Modules, readModules} from "../../src/modules";

describe("Read Modules", () => {
    it("Iterates through each module.", () => {
        let moduleNames = [];
        let result = Modules.map(module => module.name);
        readModules(module => moduleNames.push(module.name));

        expect(moduleNames).toEqual(result);
    });
});