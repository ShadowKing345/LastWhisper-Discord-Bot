import {readModules} from "../src/modules";

test("Modules Test", async () => {
    let hold = [];

    await readModules(module => hold.push(module.name), "src/modules");

    expect(hold).toEqual(["BuffManager", "EventManager", "ManagerUtils", "RoleManager"]);
});