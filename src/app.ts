import { container } from "tsyringe";
import { Bot } from "./utils/objects/bot.js";

/**
 * Main function of application.
 * Should be used as starting point if bot needs to be started.
 */
export async function main() {
  process.setMaxListeners(30);
  console.log(
    "Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.",
  );

  let app: Bot;
  try {
    app = container.resolve(Bot);
    // await app.init();

    // process.on("SIGTERM", () => app.stop())
    //     .on("SIGINT", () => app.stop())
    //     .on("uncaughtException", () => app.stop());


    // await app.run();
  } catch (error) {
    console.error(error instanceof Error ? error.stack : error);
    await app.stop();
  }
}
