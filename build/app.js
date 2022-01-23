"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata");
const moduleConfiguration_1 = require("./config/moduleConfiguration");
const client_1 = require("./classes/client");
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const appConfigs_1 = require("./config/appConfigs");
const databaseConfiguration_1 = require("./config/databaseConfiguration");
class App {
    constructor() {
        this.client = new client_1.Client();
    }
    async load() {
        console.debug("Loading Configurations");
        (0, appConfigs_1.initConfigs)();
        console.debug("Creating Db Client");
        await (0, databaseConfiguration_1.createDbClient)();
        console.debug("Loading modules.");
        (0, moduleConfiguration_1.loadModules)(this.client);
        this.client.once("ready", () => console.debug("Bot is up and ready to roll!"));
        console.debug("Done loading. Ready to run.");
    }
    async run() {
        return this.client.login(appConfigs_1.CONFIGS.token);
    }
}
exports.App = App;
async function main() {
    dayjs_1.default.extend(duration_1.default);
    dayjs_1.default.extend(weekOfYear_1.default);
    dayjs_1.default.extend(advancedFormat_1.default);
    dayjs_1.default.extend(customParseFormat_1.default);
    const app = new App();
    await app.load();
    await app.run();
}
main().catch(err => console.error(err));
