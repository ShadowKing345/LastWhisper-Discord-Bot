import {EventManagerSettingsRepository} from "../repositories/eventManager/eventManagerSettingsRepository.js";
import {EventManagerSettings} from "../entities/eventManager/index.js";
import {EventManagerService} from "./eventManager.js";
import {EventObjectRepository} from "../repositories/eventManager/eventObjectRepository.js";
import {EventReminderRepository} from "../repositories/eventManager/eventReminderRepository.js";
import {DateTime} from "luxon";
import {test} from "node:test";
import Assert from "node:assert";

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

test("Testing the parser.", async t => {
    await t.test("Message got parsed correctly.", async () => {
        const service = new EventManagerService(new MockSettingRepo(), new MockObjectRepo(), new MockReminderRepo());

        const result = await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${DateTime.now().plus({days: 1}).toUnixInteger()}:f>`);
        Assert.ok(result);
        Assert.ok(result?.isValid);
    });

    await t.test("Message is wrong", async () => {
        const service = new EventManagerService(new MockSettingRepo(), new MockObjectRepo(), new MockReminderRepo());
        const now = DateTime.now().plus({days: 1}).toUnixInteger();

        Assert.ok(!(await service.parseEvent("0", `[description]\nTesting\n[time]\n<t:${now}:f>`)).isValid, "Bad event name")
        Assert.ok(!(await service.parseEvent("0", `[announcement]\nHello World\n[time]\n<t:${now}:f>`)).isValid, "Bad event description")
        Assert.ok(!(await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting`)).isValid, "Bad time")
        Assert.ok(!(await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${0}:f>`)).isValid, "Time is before now");
    });
}).catch(console.error);