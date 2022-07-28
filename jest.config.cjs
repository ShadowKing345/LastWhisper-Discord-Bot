module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: "jest-environment-node",
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    resolver: "./resolver.cjs"
};