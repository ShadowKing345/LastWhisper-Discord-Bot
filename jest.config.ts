import type { Config } from "jest";

const isDev = process.env.NODE_ENV === "development";

const config: Config = {
  preset: isDev ? "ts-jest" : undefined,

  clearMocks: true,
  collectCoverage: true,

  testEnvironment: "node",
  verbose: true,

  testPathIgnorePatterns: [
    "/node_modules/",
    isDev ? "/build/" : "/src/",
    isDev ? "/src/migrations/" : "/build/migrations/"],
};

export default config;