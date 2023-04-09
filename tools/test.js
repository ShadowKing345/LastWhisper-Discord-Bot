import "reflect-metadata";

import {run} from "node:test";
import {globSync} from "glob";

function main() {
    let files;

    if (process.env.NODE_ENV === "development") {
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

main();