var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "reflect-metadata";
import { jest } from "@jest/globals";
import { DateTime, Duration } from "luxon";
import { container, injectable } from "tsyringe";
import { DatabaseConfigurationService } from "../../src/utils/config/databaseConfigurationService.js";
import { EventObj, ReminderTrigger } from "../../src/models/event_manager/index.js";
import { MockDatabase } from "../utils/mockDatabase.js";
import { EventManagerService } from "../../src/services/eventManager.service.js";
let Module = class Module extends EventManagerService {
    static parseTriggerDuration(triggerTime) {
        return EventManagerService.parseTriggerDuration(triggerTime);
    }
};
Module = __decorate([
    injectable()
], Module);
describe("The event manager service's", () => {
    const mockDb = container.registerSingleton(DatabaseConfigurationService, MockDatabase).resolve(DatabaseConfigurationService);
    const module = container.resolve(Module);
    const config = {
        _id: undefined,
        dateTimeFormat: "yyyy-mm-dd",
        delimiterCharacters: ["\\[", "\\]"],
        events: [],
        guildId: "3",
        listenerChannelId: "Correct",
        postingChannelId: "Correct2",
        reminders: [],
        tags: {
            announcement: "Event",
            description: "Description",
            dateTime: "Time",
            exclusionList: [],
        },
    };
    const defaultMessageOptions = {
        id: "Fish",
        client: {
            application: {
                id: "0",
            },
        },
        author: {
            id: "1",
        },
        guildId: "3",
        channelId: "Correct",
    };
    beforeAll(() => jest.useFakeTimers());
    afterAll(() => jest.useRealTimers());
    beforeEach(() => {
        mockDb.config = config;
    });
    describe("parseTriggerDuration function should", () => {
        describe("properly parse the hour.", () => {
            test("04:15", () => expect(Module.parseTriggerDuration("04:15")).toEqual(Duration.fromObject({
                hours: 4,
                minutes: 15,
            })));
            test("15:30", () => expect(Module.parseTriggerDuration("15:30")).toEqual(Duration.fromObject({
                hours: 15,
                minutes: 30,
            })));
            test("00:00", () => expect(Module.parseTriggerDuration("00:00")).toEqual(Duration.fromObject({
                hours: 0,
                minutes: 0,
            })));
        });
    });
    describe("createEvent function should", () => {
        const content = "[Event] Test [Description] Test description. [Time] ";
        const message = {
            ...defaultMessageOptions,
            react: jest.fn(),
            content,
        };
        beforeAll(() => jest.setSystemTime(0));
        afterAll(() => jest.setSystemTime(0));
        describe("be able to register an event with", () => {
            describe("unix timestamp.", () => {
                beforeEach(async () => {
                    message.react.mockClear();
                    message.content = content + `<t:${(DateTime.fromSeconds(300)).toUnixInteger()}:r>`;
                    config.events = [];
                    await module.createEvent(message);
                });
                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Correct time.", () => expect(mockDb.config.events[0].dateTime).toBe(DateTime.fromSeconds(300).toUnixInteger()));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });
            describe("normal format.", () => {
                beforeEach(async () => {
                    message.react.mockClear();
                    message.content = content + "2022-12-30";
                    config.events = [];
                    await module.createEvent(message);
                });
                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Correct time.", () => expect(mockDb.config.events[0].dateTime).toBe(DateTime.fromFormat("2022-12-30", "yyyy-mm-dd").toUnixInteger()));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });
            describe("additional tags", () => {
                beforeEach(async () => {
                    message.react.mockClear();
                    message.content = content + "<t:300:r> [Test Tag 1] Fish [Test Tag 2] Tree";
                    config.events = [];
                    await module.createEvent(message);
                });
                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Content is correct", () => expect(mockDb.config.events[0].additional).toEqual([
                    ["Test Tag 1", "Fish"],
                    ["Test Tag 2", "Tree"],
                ]));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });
        });
        describe("fail to register event when", () => {
            describe("tag is not there.", () => {
                beforeEach(async () => {
                    message.react.mockClear();
                    message.content = "[Event] Test [Description] Test description.";
                    config.events = [];
                    await module.createEvent(message);
                });
                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("❎"));
            });
            describe("time is in the wrong format.", () => {
                beforeEach(async () => {
                    message.react.mockClear();
                    message.content = content + `${(DateTime.fromSeconds(300)).toFormat("yyyy")}`;
                    config.events = [];
                    await module.createEvent(message);
                });
                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("❎"));
            });
            describe("time is before now.", () => {
                beforeAll(() => jest.setSystemTime(DateTime.fromFormat("2022-01-01", "yyyy-mm-dd").toJSDate()));
                afterAll(() => jest.setSystemTime(0));
                beforeEach(async () => {
                    message.react.mockClear();
                    message.content = content + "<t:0:r>";
                    config.events = [];
                    await module.createEvent(message);
                });
                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("❎"));
            });
        });
    });
    describe("updateEvent function should", () => {
        const oldEvent = new EventObj("Fish", "Test", "Test Description", 300, [["Test 1", "fish"]]);
        const content = "[Event] New Event [Description] New Event Test Description. [Time] <t:400:r>";
        const oldMessage = {
            ...defaultMessageOptions,
            react: jest.fn(),
        };
        const newMessage = {
            ...defaultMessageOptions,
            reactions: {
                cache: {
                    find: () => null,
                },
            },
            react: jest.fn(),
        };
        describe("be able to change the event.", () => {
            beforeEach(async () => {
                config.events = [oldEvent];
                newMessage.content = content;
                await module.updateEvent(oldMessage, newMessage);
            });
            test("Reacted correctly.", () => expect(newMessage.react).toBeCalledWith("✅"));
            test("Is not old event.", () => expect(config.events[0]).not.toBe(oldEvent));
            test("Event is now.", () => expect(config.events[0]).toEqual(new EventObj("Fish", "New Event", "New Event Test Description.", 400)));
        });
    });
    describe("deleteEvent function should", () => {
        const message = {
            ...defaultMessageOptions,
        };
        test("be able to remove events when id is valid.", async () => {
            config.events = [new EventObj("Fish", "Test", "Test description", 500)];
            await module.deleteEvent(message);
            expect(config.events.length).toBe(0);
        });
        test("be able to remove events when id is not valid.", async () => {
            config.events = [new EventObj("Wrong Id", "Test", "Test description", 500)];
            await module.deleteEvent(message);
            expect(config.events.length).toBe(1);
        });
    });
    describe("reminderLoop function should", () => {
        const channelSendFunction = jest.fn();
        const client = {
            guilds: {
                cache: {
                    has: () => true,
                },
            },
            channels: {
                cache: {
                    has: () => true,
                },
                fetch: () => ({
                    guildId: "3",
                    send: channelSendFunction,
                }),
            },
            isReady: () => true,
        };
        beforeAll(() => jest.setSystemTime(500));
        afterAll(() => jest.setSystemTime(0));
        beforeEach(() => channelSendFunction.mockClear());
        test("remove old events.", async () => {
            config.events = [new EventObj("Fish", "Test Event", "Test Description.", 0)];
            await module.reminderLoop(client);
            expect(config.events.length).toBe(0);
        });
        describe("remove old events only.", () => {
            const events = [new EventObj("Test 1", "Test Event 1", "Test description 1", 700), new EventObj("Test 2", "Test Event 2", "Test description 2", 800)];
            beforeEach(async () => {
                config.events = [events[0], new EventObj("Fish", "Test Event", "Test Description.", 0), events[1]];
                await module.reminderLoop(client);
            });
            test("Length is correct.", () => expect(config.events.length).toBe(2));
            test("Order is correct.", () => expect(config.events).toEqual(events));
        });
        test("post a reminder of when the event is about to start.", async () => {
            jest.setSystemTime(0);
            config.reminders = [new ReminderTrigger("Testing.", "00:10"),];
            config.events = [new EventObj("Fish", "Test Event", "Test Description.", 600)];
            await module.reminderLoop(client);
            expect(channelSendFunction).toBeCalledWith("Testing.");
        });
        test("post a reminder of when the event is about to start. With correct formatting.", async () => {
            jest.setSystemTime(0);
            config.reminders = [new ReminderTrigger("Testing. %everyone%, %eventName%, %hourDiff%, %minuteDiff%, %randomTag%.", "00:10"),];
            config.events = [new EventObj("Fish", "Test Event", "Test Description.", 600)];
            await module.reminderLoop(client);
            expect(channelSendFunction).toBeCalledWith("Testing. @everyone, Test Event, 0, 10, %randomTag%.");
        });
    });
});
//# sourceMappingURL=eventManager.service.test.js.map