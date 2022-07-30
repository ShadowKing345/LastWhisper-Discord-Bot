import "reflect-metadata";

import { injectable, container } from "tsyringe";

import { EventManagerService, EventManagerConfig } from "../../src/event_manager/index.js";
import { Duration, DateTime } from "luxon";
import { DatabaseConfiguration } from "../../src/config/databaseConfiguration.js";
import { jest } from "@jest/globals";
import { Message } from "discord.js";

@injectable()
class Module extends EventManagerService {
    public static parseTriggerDuration(triggerTime: string): Duration {
        return EventManagerService.parseTriggerDuration(triggerTime);
    }
}

describe("The event manager service's", () => {
    const mockDb: MockDatabase = container.register(DatabaseConfiguration, MockDatabase).resolve(DatabaseConfiguration) as MockDatabase;
    const module = container.resolve(Module);

    beforeAll(() => jest.useFakeTimers());
    afterAll(() => jest.useRealTimers());

    beforeEach(() => {
        mockDb.config = new EventManagerConfig();
    })

    describe("parseTriggerDuration function should", () => {
        describe("properly parse the hour.", () => {
            test("04:15", () => expect(Module.parseTriggerDuration("04:15")).toEqual(Duration.fromObject({
                hours: 4,
                minutes: 15
            })));

            test("15:30", () => expect(Module.parseTriggerDuration("15:30")).toEqual(Duration.fromObject({
                hours: 15,
                minutes: 30
            })));

            test("00:00", () => expect(Module.parseTriggerDuration("00:00")).toEqual(Duration.fromObject({
                hours: 0,
                minutes: 0
            })));
        });
    });

    describe("createEvent function should", () => {
        const content = "[Event] Test [Description] Test description. [Time] ";
        const message: Message = {
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
            content
        } as unknown as Message;

        beforeEach(() => message.content = content);

        describe("be able to register an event with", () => {
            describe("unix timestamp.", async () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = content + `<t:${(DateTime.fromSeconds(300)).toUnixInteger()}>`;
                    await module.createEvent(message);
                });

                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Correct time.", () => expect(mockDb.config.events[0].dateTime).toBe(DateTime.fromSeconds(300).toUnixInteger()));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });

            describe("normal format.", async () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = content + `${(DateTime.fromSeconds(300)).toFormat("yyyy-mm-dd")}`;
                    await module.createEvent(message);
                });

                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Correct time.", () => expect(mockDb.config.events[0].dateTime).toBe(DateTime.fromSeconds(300).toUnixInteger()));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });

            describe("additional tags", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = content + "<\t:300> [Test Tag 1] Fish [Test Tag 2] Tree";
                    await module.createEvent(message);
                });

                test("Saved event.", () => expect(mockDb.config.events.length).toBe(1));
                test("Content is correct", () => expect(mockDb.config.events[0].additional).toEqual({
                    "Test Tag 1": "Fish",
                    "Test Tag 2": "Tree"
                }));
                test("Reacted properly", () => expect(message.react).toBeCalledWith("✅"));
            });
        });

        describe("fail to register event when", () => {
            describe("tag is not there.", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = "[Event] Test [Description] Test description.";
                    await module.createEvent(message);
                });

                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.reply).toBeCalledWith("❎"));
            });

            test.todo("time is in the wrong format.", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = content + `${(DateTime.fromSeconds(300)).toFormat("yyyy")}`;
                    await module.createEvent(message);
                });

                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.reply).toBeCalledWith("❎"));
            });

            test.todo("time is before now.", () => {
                beforeEach(async () => {
                    (message.react as jest.Mock).mockClear();
                    message.content = content + `${(DateTime.fromSeconds(300).minus(Duration.fromObject({ days: 3 }))).toFormat("yyyy-mm-dd")}`;
                    await module.createEvent(message);
                });

                test("No new event", () => expect(mockDb.config.events.length).toBe(0));
                test("Reacted properly", () => expect(message.reply).toBeCalledWith("❎"));
            });
        });
    });
});