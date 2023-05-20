#!/usr/bin/env node
import "reflect-metadata";

import { program } from "commander";
import { userInfo } from "os";
import { ConfigurationService } from "./config/configurationService.js";
import { ApplicationConfiguration, CommandRegistrationConfiguration, CommonConfigurationKeys } from "./config/index.js";
import "./modules/index.js";
import { Bot } from "./objects/index.js";
import { manageCommands } from "./slashCommandManager.js";
import { Commander } from "./decorators/index.js";
import { isObject } from "./utils/index.js";
import fs from "fs";
import * as readline from "readline";
import { seedDb } from "./utils/database/seedDb.js";
import { Logger } from "./utils/logger/logger.js";


class Index {
    private static readonly logger = new Logger( "InitScript" );

    constructor() {
        program.name( "discord-bot" ).description( "Discord Bot." );
    }

    /**
     * The main command that will deploy the bot.
     * Should be used as starting point for the bot as it sets up the environment.
     * @param opts Options passed to the command. Expected to be an empty object if none were passed.
     */
    @Commander.addCommand( {
        name: "deploy",
        opts: { isDefault: true },
        description: "Runs to bot.",
        options: [
            { flags: "-t, --token <string>", description: "The Discord Token to be used." },
        ],
    } )
    public async runBot( opts: unknown ) {
        process.setMaxListeners( 30 );
        Index.logger.info( "Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon." );

        let bot: Bot;
        try {
            let token: string = undefined;

            if( ( opts && isObject( opts ) ) && ( "token" in opts && typeof opts.token === "string" ) ) {
                token = opts.token;
            }

            bot = new Bot( token );
            await bot.init();
            await bot.run();

            process.on( "exit", () => this.exit( bot ) );
            process.on( "SIGINT", () => this.exit( bot ) );
            process.on( "SIGTERM", () => this.exit( bot ) );
        } catch( error ) {
            if( bot ) {
                this.exit( bot );
            }

            Index.logger.error( error instanceof Error ? error.stack : error );
        }
    }

    /**
     * Command that manages the Discord slash commands.
     * @param {string} subcommand The subcommand used to manage the commands. 
     * @param {unknown} opts Options passed to the command. Expected to be an empty object if none were passed.
     */
    @Commander.addCommand( {
        name: "commandManager",
        description: "Handles the various tasks relation providing slash commands to Discord.",
        arguments: [ { name: "[subcommand]", description: "[register, unregister]", defaultValue: "register" } ],
        options: [
            { flags: "-t, --token <string>", description: "Token for bot." },
            { flags: "-c, --client <string>", description: "Client ID." },
            {
                flags: "-g, --guild <string>",
                description: "Guild ID to register commands for. If this is set configuration file options will be ignored.",
            },
        ],
    } )
    public async runCommandManager( subcommand: "register" | "unregister", opts: unknown ) {
        if( !( subcommand === "register" || subcommand === "unregister" ) ) {
            throw new Error( "Invalid subcommand. You can only provide [register, unregister]" )
        }
        const config: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();
        let token: string = undefined;

        if( isObject( opts ) ) {
            if( "token" in opts && typeof opts.token === "string" ) {
                token = opts.token;
            }

            config.clientId = "client" in opts && typeof opts.client === "string" ? opts.client : null;

            if( "guild" in opts && typeof opts.guild === "string" ) {
                config.guildId = opts.guild;
                config.registerForGuild = true;
            } else {
                config.guildId = null;
                config.registerForGuild = null;
            }
        }

        return manageCommands( token, subcommand === "unregister", config );
    }

    /**
     * Command that attempts to process a JSON object and have a database be seeded with its values.
     * If the file option was set then an attempt will be made to read the file.
     * Else if the argument was passed (body) then it will use that.
     * Else, it will look at the stdin for an input or wait for one.
     * @param body The body text, undefined if none was set.
     * @param opts Options passed to the command. Expected to be an empty object if none were passed.
     */
    @Commander.addCommand( {
        name: "seedDatabase",
        description: "Attempts to pre-seed the database with provided data. Note that the data has to be a JSON formatted object.\n" +
            "This uses whatever was passed in stdin if the file location was not specified.",
        arguments: [ { name: "[object]", description: "The JSON object to be parsed." } ],
        options: [
            { flags: "-f, --file <path>", description: "The location of the file to be read from. Uses " },
        ],
    } )
    public async seedDatabase( body: string, opts: Record<string, unknown> ) {
        try {
            let str: string = null;

            if( ( opts && isObject( opts ) ) && ( "file" in opts && typeof opts.file === "string" ) ) {
                if( !fs.existsSync( opts.file ) ) {
                    throw new Error( "File does not exit." );
                }

                str = fs.readFileSync( opts.file, "utf-8" );
            } else if( body != undefined ) {
                str = body;
            } else {
                str = await new Promise( ( resolve ) => {
                    const rl = readline.createInterface( { input: process.stdin } );
                    rl.once( "line", ( line ) => {
                        resolve( line );
                        rl.close();
                    } );
                } );
            }

            if( str === null ) {
                throw new Error( "Unable to find a valid JSON object to process." );
            }

            let jsonObj: object;
            try {
                jsonObj = JSON.parse( str ) as object;
            } catch( error ) {
                Index.logger.debug( error instanceof Error ? error.stack : error as string | object );
                throw new Error( "The JSON string was not valid. Terminating." );
            }

            await seedDb( jsonObj as Record<string, unknown> );
        } catch( error ) {
            Index.logger.error( error );
        }
    }

    /**
     * Attempts to exit the application in a clean manner to prevent memory leaks.
     * @param bot The bot application.
     * @private
     */
    private exit( bot: Bot ): void {
        bot.stop().then( null, error => console.error( error ) );
    }

    /**
     * Ensures the environment was set up for the commands.
     */
    @Commander.hook( "preAction" )
    public preInit() {
        Index.logger.info( `Welcome ${ userInfo().username }.` );
        ConfigurationService.registerConfiguration<ApplicationConfiguration>( CommonConfigurationKeys.APPLICATION );
    }

    /**
     * Starts the commander parsing tasks.
     */
    public parse() {
        program.parse();
    }
}

const index = new Index();
index.parse();