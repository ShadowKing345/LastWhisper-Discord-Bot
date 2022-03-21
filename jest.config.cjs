const ts = require("ts-jest/jest-preset");
const mongoDb = require("@shelf/jest-mongodb/jest-preset");
const {recursive} = require("merge");

module.exports = recursive(ts, mongoDb, {
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
