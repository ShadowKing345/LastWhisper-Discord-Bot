module.exports = {
    displayName: "FFXIV Discord Bot Jest",
    notify: true,
    testRegex: "(/test[s]/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    preset: "@shelf/jest-mongodb",
    extensionsToTreatAsEsm: [".ts"],
};