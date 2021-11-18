import {getConfig, parseMessage, splitChunk} from "../../src/modules/eventManager"
import {EventManagerConfig, EventObj, ReminderTrigger, Tags} from "../../src/objects/EventManager";

jest.mock("../../src/models/EventManager", () => {
    let data = [
        new class implements EventManagerConfig {
            _id: string = "correct";
            dateTimeFormat: string[] = [];
            delimiterCharacters: [string, string] = ["\\[", "\\]"];
            events: EventObj[] = [];
            listenerChannelId: string | null = null;
            postingChannelId: string | null = null;
            reminders: ReminderTrigger[] = [];
            tags: Tags = new class implements Tags {
                announcement: string = "Event Announcement";
                dateTime: string = "Time";
                description: string = "Event Description";
                exclusionList: string[] = ["Ignore"];
            };
        }
    ]

    return ({
        findOne: async (filter: { [key: string]: string }) => {
            for (let [key, value] of Object.entries(filter)) {
                let found = data.find(entry => entry[key] && entry[key] === value);
                if (found != null) return found;
            }

            return null;
        },
        create: async (setters: { [key: string]: string }) => {
            let obj = new EventManagerConfig();
            for (let [key, value] of Object.entries(setters)) {
                obj[key] = value;
            }

            return obj;
        }
    });
});

describe("Chunk Splitting Method", () => {
    it("Normal Expected Operation", () => expect(splitChunk(["Event Announcement", "Example Tittle", "Event Description", "Example Description", "Time", "Fish"])).toEqual([["Event Announcement", "Example Tittle"], ["Event Description", "Example Description"], ["Time", "Fish"]]));
    it("Uneven Array", () => expect(splitChunk(["Test"])).toEqual([["Test", undefined]]));
    it("Empty Array", () => expect(splitChunk([])).toEqual([]));
});

describe("Event Parser", () => {
    let config: EventManagerConfig = new EventManagerConfig();
    config.tags.exclusionList.push("Ignore");

    describe("Valid Message", () => {
        let content = "[ Event Announcement ]\n" +
            "Example Title\n" +
            "[ Event Description ]\n" +
            "Example Description\n" +
            "[ Example Tag 1 ]\n" +
            "Test info!\n" +
            "[ Ignore ]\n" +
            "This should be ignored." +
            "[ Time ]\n" +
            "<t:1636976220:D>";
        let result = parseMessage(null, content, config);

        it("Is Valid", () => expect(result.isValid).toBe(true));
        it("Equivalent Check", () => expect(result).toEqual(new EventObj(null, "Example Title", "Example Description", new Date(1636976220 * 1000), [["Example Tag 1", "Test info!"]])));
        it("Ignored Additional", () => expect(result.additional.filter(l => l === ["Ignore", "This should be ignored."])).toEqual([]));
    });

    it("No Valid Tags", () => expect(parseMessage(null, "yolo", config).isValid).toBe(false));
    it("Empty Paragraph", () => expect(parseMessage(null, "", config).isValid).toBe(false));
    it("Missing Tag Value", () => expect(parseMessage(null, "[Event Announcement]", config).isValid).toBe(false));
});

describe("Acquiring configs", () => {
    it("Correct Id", async () => expect(await getConfig("correct")).toBeDefined());
    it("Incorrect Id", async () => expect(await getConfig("nope")).toBeDefined());
    it("Empty Id, Should Throw", () => expect(getConfig("")).rejects.toBeInstanceOf(ReferenceError))
    it("Null Id, Should Throw", () => expect(getConfig(null)).rejects.toBeInstanceOf(ReferenceError));
});