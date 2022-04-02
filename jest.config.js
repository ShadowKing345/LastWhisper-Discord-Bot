import ts from "ts-jest/jest-preset.js";
import mongoDb from "@shelf/jest-mongodb/jest-preset.js";
import {recursive} from "merge";

export default recursive(ts, mongoDb, {
    notify: true,
    testRegex: "(/test[s]/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    bail: false,
    globals: {
        "ts-jest": {
            useESM: true,
            isolatedModules: true
        }
    }
});
