import "reflect-metadata";

import assert from "node:assert";
import { describe, it } from "node:test";
import { ApplicationConfiguration, CommandRegistrationConfiguration, DatabaseConfiguration, LoggerConfigs, ModuleConfiguration } from "../../../src/configurations/index.js";

describe( "Application configuration tests", () => {
    it( "should be able to merge all objects", () => {
        const token = "Test Token";
        const database = new DatabaseConfiguration();
        const commandRegistration = new CommandRegistrationConfiguration();
        const logger = new LoggerConfigs();
        const module = new ModuleConfiguration();

        const applicationConfiguration = new ApplicationConfiguration();

        assert.notStrictEqual( applicationConfiguration.token, token );

        applicationConfiguration.merge( { token, database, commandRegistration, logger, moduleConfiguration: module } );
        assert.strictEqual( applicationConfiguration.token, token );
    } ).catch(console.error);

    it( "should create a valid object with all the parameters", () => {
        const config = new ApplicationConfiguration();

        assert.strictEqual( config.token, null, "Token" );
        assert.ok( config.moduleConfiguration, "Module Configuration" );
        assert.ok( config.database, "Database Configuration" );
        assert.ok( config.commandRegistration, "Command Registration Configuration" );
        assert.ok( config.logger, "Logger Configuration" );
    } ).catch(console.error);
} ).catch(console.error);