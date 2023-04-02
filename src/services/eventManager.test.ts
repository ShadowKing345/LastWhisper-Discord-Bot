import tap from "tap";
import {EventManagerSettingsRepository} from "../repositories/eventManager/eventManagerSettingsRepository.js";
import {EventManagerSettings} from "../entities/eventManager/index.js";
import {EventManagerService} from "./eventManager.js";
import {EventObjectRepository} from "../repositories/eventManager/eventObjectRepository.js";
import {EventReminderRepository} from "../repositories/eventManager/eventReminderRepository.js";
import {DateTime} from "luxon";

class MockSettingRepo extends EventManagerSettingsRepository {
    private readonly settings: EventManagerSettings;

    constructor() {
        super(null);

        const settings = new EventManagerSettings();
        settings.guildId = "0";
        settings.delimiterCharacters = ["[", "]"];
        settings.announcement = "announcement";
        settings.description = "description";
        settings.dateTime = "time";

        this.settings = settings;
    }


    public async findOneOrCreateByGuildId(): Promise<EventManagerSettings> {
        return Promise.resolve(this.settings);
    }
}

class MockObjectRepo extends EventObjectRepository {
    constructor() {
        super(null);
    }
}

class MockReminderRepo extends EventReminderRepository {
    constructor() {
        super(null);
    }
}

tap.test("Testing the parser.", async t => {
    await t.test("Message got parsed correctly.", async t => {
        const service = new EventManagerService(new MockSettingRepo(), new MockObjectRepo(), new MockReminderRepo());

        const result = await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${DateTime.now().plus({days: 1}).toUnixInteger()}:f>`);
        t.ok(result);
        t.ok(result?.isValid);

        t.end();
    });

    await t.test("Message is wrong", async t => {
        const service = new EventManagerService(new MockSettingRepo(), new MockObjectRepo(), new MockReminderRepo());
        const now = DateTime.now().plus({days: 1}).toUnixInteger();

        t.notOk((await service.parseEvent("0", `[description]\nTesting\n[time]\n<t:${now}:f>`)).isValid, "Bad event name")
        t.notOk((await service.parseEvent("0", `[announcement]\nHello World\n[time]\n<t:${now}:f>`)).isValid, "Bad event description")
        t.notOk((await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting`)).isValid, "Bad time")
        t.notOk((await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${0}:f>`)).isValid, "Time is before now");

        t.end();
    });

    t.end();
}).catch(console.error);