import {EventManagerSettingsRepository} from "../../src/repositories/eventManager/eventManagerSettingsRepository.js";
import {EventManagerService} from "../../src/services/eventManager.js";
import {EventObjectRepository} from "../../src/repositories/eventManager/eventObjectRepository.js";
import {EventReminderRepository} from "../../src/repositories/eventManager/eventReminderRepository.js";
import {DateTime} from "luxon";
import {test} from "node:test";
import Assert from "node:assert";
import {mockRepository} from "../utils/mockRepository.js";
import {EventManagerSettings} from "../../src/entities/eventManager/index.js";


test("Testing the parser.", async t => {
    const settingsRepo = mockRepository(EventManagerSettingsRepository);
    const eventObjRepo = mockRepository(EventObjectRepository);
    const reminderRepo = mockRepository(EventReminderRepository);

    t.beforeEach(() => {
        settingsRepo._clear();
        eventObjRepo._clear();
        reminderRepo._clear();
    });

    await t.test("Message got parsed correctly.", async () => {
        settingsRepo._addItem("0", new EventManagerSettings({
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        }));
        const service = new EventManagerService(settingsRepo, eventObjRepo, reminderRepo);

        const result = await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${DateTime.now().plus({days: 1}).toUnixInteger()}:f>`);
        Assert.ok(result);
        Assert.ok(result?.isValid);
    });

    await t.test("Message is wrong", async () => {
        settingsRepo._addItem("0", new EventManagerSettings({
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        }));
        const service = new EventManagerService(settingsRepo, eventObjRepo, reminderRepo);
        const now = DateTime.now().plus({days: 1}).toUnixInteger();

        Assert.ok(!(await service.parseEvent("0", `[description]\nTesting\n[time]\n<t:${now}:f>`)).isValid, "Bad event name")
        Assert.ok(!(await service.parseEvent("0", `[announcement]\nHello World\n[time]\n<t:${now}:f>`)).isValid, "Bad event description")
        Assert.ok(!(await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting`)).isValid, "Bad time")
        Assert.ok(!(await service.parseEvent("0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${0}:f>`)).isValid, "Time is before now");
    });

    t.todo("Event ticked");
}).catch(console.error);