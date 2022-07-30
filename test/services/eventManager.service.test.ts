import "reflect-metadata";

import { jest } from "@jest/globals";
import { Message } from "discord.js";
import { DateTime, Duration } from "luxon";
import { container, injectable } from "tsyringe";

import { DatabaseConfiguration } from "../../src/config/databaseConfiguration.js";
import { EventManagerConfig, EventManagerService } from "../../src/event_manager/index.js";
import { MockDatabase } from "../utils/mockDatabase.js";

@injectable()
class Module extends EventManagerService {
    public static parseTriggerDuration(triggerTime: string): Duration {
        return EventManagerService.parseTriggerDuration(triggerTime);
    }
}

describe("The event manager service's", () => {
    const mockDb: MockDatabase = container.registerSingleton(DatabaseConfiguration, MockDatabase).resolve(DatabaseConfiguration) as MockDatabase;
    const module = container.resolve(Module);
    const config: EventManagerConfig = {
        _id: undefined,
        dateTimeFormat: "yyyy-mm-dd",
        delimiterCharacters: [ "\\[", "\\]" ],
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
        const message: Message = {
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
            react: jest.fn(),
            content,
        } as unknown as Message;

        beforeEach(() => message.content = content);

        describe("be able to register an event with", () => {
            describe("unix timestamp.", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
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
                    (message.react as jest.Mock).mockClear();
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
                    (message.react as jest.Mock).mockClear();
                    message.content = content + "<t:300:r> [Test Tag 1] Fish [Test Tag 2] Tree";
                    config.events = [];
                    await module.createEvent(message);
                });

                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Content is correct", () => expect(mockDb.config.events[0].additional).toEqual([
                    [ "Test Tag 1", "Fish" ],
                    [ "Test Tag 2", "Tree" ],
                ]));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });
        });

        describe("fail to register event when", () => {
            describe("tag is not there.", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = "[Event] Test [Description] Test description.";
                    config.events = [];
                    await module.createEvent(message);
                });

                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("❎"));
            });

            describe("time is in the wrong format.", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
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
                    (message.react as jest.Mock).mockClear();
                    message.content = content + "<t:0:r>";
                    config.events = [];
                    await module.createEvent(message);
                });

                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("❎"));
            });
        });
    });
});