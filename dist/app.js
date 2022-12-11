import { container } from "tsyringe";
import { Bot } from "./utils/objects/bot.js";
export async function main() {
    process.setMaxListeners(30);
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    let app;
    try {
        app = container.resolve(Bot);
    }
    catch (error) {
        console.error(error instanceof Error ? error.stack : error);
        await app.stop();
    }
}
//# sourceMappingURL=app.js.map