import "reflect-metadata";

import {run} from "node:test";
import {globSync} from "glob";
import {program} from "commander";

/** @typedef {{pattern : string | undefined}} Args */

/**
 * Main function called to run tests.
 * Will parse input arguments and change its behavior based on them.
 * @param {Args} args
 */
function main(args) {
    /** @type {string[]} */
    let files;

    if (args && typeof args === "object" && "pattern" in args && typeof args.pattern === "string") {
        files = globSync(args.pattern);
    } else if (process.env.NODE_ENV === "development") {
        files = globSync("test/**/*.test.ts");
    } else {
        files = globSync("build/**/*.test.js");
    }

    if (files.length <= 0) {
        throw new Error("No tests were found.");
    }

    run({files})
        .pipe(process.stdout);
}

program
    .option("-p, --pattern <string>", "Override the default glob patterns with your own.")
    .action((/** @type {Args} */ args) => main(args))
    .parse();