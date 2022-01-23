import "reflect-metadata";
import {loadModules} from "./config/moduleConfiguration";
import {Client} from "./classes/client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {CONFIGS, initConfigs} from "./config/appConfigs";
import {createDbClient} from "./config/databaseConfiguration";

export class App {
    private readonly client: Client;

    constructor() {
        this.client = new Client();
    }

    public async load() {
        console.debug("Loading Configurations");
        initConfigs();

        console.debug("Creating Db Client");
        await createDbClient();

        console.debug("Loading modules.");
        loadModules(this.client);

        this.client.once("ready", () => console.debug("Bot is up and ready to roll!"));

        console.debug("Done loading. Ready to run.");
    }

    public async run(){
        return this.client.login(CONFIGS.token);
    }
}

async function main() {
    dayjs.extend(duration);
    dayjs.extend(weekOfYear);
    dayjs.extend(advancedFormat);
    dayjs.extend(customParseFormat);

    const app: App = new App();
    await app.load();

    await app.run();
}

main().catch(err => console.error(err));