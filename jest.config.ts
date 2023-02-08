import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",

  clearMocks: true,
  collectCoverage: true,

  testEnvironment: "node",
  verbose: true,

  testPathIgnorePatterns: ["/node_modules/", "/build/"],
};

export default config;