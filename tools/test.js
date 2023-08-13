import "reflect-metadata";

import { tap } from "node:test/reporters"
import { run } from "node:test";
import process from "node:process";
import { globSync } from "glob";
import { program } from "commander";

/** @typedef {{pattern : string | undefined}} Args */

/**
 * Main function called to run tests.
 * Will parse input arguments and change its behavior based on them.
 * @param {Args} args
 */
function main( args ) {
    /** @type {string[]} */
    let files;

    process.env.DEV_DISABLE_LOGGING = 'true';

    if( args && typeof args === "object" && "pattern" in args && typeof args.pattern === "string" ) {
        files = globSync( args.pattern );
    } else if( process.env.NODE_ENV === "development" ) {
        files = globSync( "test/**/*.test.ts" );
    } else {
        files = globSync( "build/**/*.test.js" );
    }

    if( files.length <= 0 ) {
        throw new Error( "No tests were found." );
    }

    run( { files } )
        .compose( tap )
        .pipe( process.stdout );
}

program
    .option( "-p, --pattern <string>", "Override the default glob patterns with your own." )
    .action( (/** @type {Args} */ args ) => main( args ) )
    .parse();