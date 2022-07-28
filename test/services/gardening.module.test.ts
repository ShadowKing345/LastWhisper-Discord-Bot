import "reflect-metadata";

import { jest } from "@jest/globals";
import { CommandInteraction } from "discord.js";
import { container, injectable } from "tsyringe";

import { DatabaseConfiguration } from "../../src/config/databaseConfiguration.js";
import { GardeningConfig, GardeningManagerService, Plot, Reason, Slot } from "../../src/gardening_manager/index.js";
import { InvalidArgumentError } from "../../src/shared/models/errors.js";
import { deepMerge } from "../../src/shared/utils.js";

@injectable()
class MockModule extends GardeningManagerService {
    public validatePlotAndSlot(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number, slotShouldExist = true) {
        return GardeningManagerService.validatePlotAndSlot(interaction, config, plotNum, slotNum, slotShouldExist);
    }

    public printPlotInfo(plot: Plot, plotNum: number, detailed = false, indent = 1) {
        return GardeningManagerService.printPlotInfo(plot, plotNum, detailed, indent);
    }

    public printSlotInfo(slot: Slot, slotNum: number, indent = 1) {
        return GardeningManagerService.printSlotInfo(slot, slotNum, indent);
    }
}

describe("Gardening Module Tests:", () => {
    let slot: Slot = {
        player: "Shadowking124",
        duration: 3,
        plant: "Test",
        reason: Reason.NONE,
        started: 1,
        next: [],
    };
    let plot: Plot = {
        name: "Test Plot.",
        description: "Test Description",
        slots: [],
    };
    let config = {
        _id: undefined,
        guildId: "",
        messagePostingChannelId: "",
        plots: [],
    };

    class mockDb {
        get db() {
            return {
                collection: () => {
                    return {
                        findOneAndReplace: async (_, obj) => {
                            Object.assign(config, obj);
                            return config;
                        },
                        findOne: async () => config,
                        find: () => ({
                            toArray: async () => [ config ],
                        }),
                        replaceOne: async (obj) => {
                            deepMerge(config, obj);
                            return config;
                        },
                    };
                },
            };
        }
    }

    container.register<DatabaseConfiguration>(DatabaseConfiguration, {
        useValue: new mockDb() as unknown as DatabaseConfiguration,
    });
    const module = container.resolve(MockModule);

    let options = {};

    const interaction = {
        reply: jest.fn(),
        client: {},
        member: { displayName: "", displayAvatarURL: () => "" },
        options: {
            getBoolean: (key: string) => {
                return options[key] ?? null;
            },
        },
    } as unknown as CommandInteraction;

    beforeAll(() => {
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        slot = {
            player: "Shadowking124",
            duration: 3,
            plant: "Test",
            reason: Reason.NONE,
            started: 1,
            next: [],
        };
        plot = {
            name: "Test Plot.",
            description: "Test Description",
            slots: [],
        };
        config = {
            _id: undefined,
            guildId: "",
            messagePostingChannelId: "",
            plots: [],
        };
        options = {};
        (interaction.reply as jest.Mock).mockReset();
    });

    describe("Validation of Plots and Slots", () => {
        const plotNum = 0;
        const slotNum = 0;

        test("should be able to get plot and slot.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            expect(result).toBeTruthy();
            expect(result[0]).toBe(plot);
            expect(result[1]).toBe(slot);
        });
        test("should return void when no plots.", async () => {
            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            expect(result).toBeFalsy();
        });
        test("should return void when no slots.", async () => {
            config.plots.push(plot);

            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            expect(result).toBeFalsy();
        });
        test("should return plot and null when no slots and slot should exist is false.", async () => {
            config.plots.push(plot);

            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, false);
            expect(result).toBeTruthy();
            expect(result[0]).toBe(plot);
            expect(result[1]).toBeFalsy();
        });

        test("should throw when argument is null:", async () => {
            await expect(module.validatePlotAndSlot(interaction, config, null, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.validatePlotAndSlot(interaction, config, plotNum, null)).rejects.toThrow(InvalidArgumentError);
            await expect(module.validatePlotAndSlot(interaction, config, plotNum, slotNum, null)).rejects.toThrow(InvalidArgumentError);
        });
    });

    // test("Print plot info", () => {
    //     const plotNum = 0;
    //
    //     test("should be able to print a basic view.", () => {
    //         plot.slots.push(slot);
    //         const correct = `Plot ${plotNum}:\n  Slot Count: 1\n`;
    //         const result = module.printPlotInfo(plot, plotNum, false);
    //         t.equal(result, correct);
    //     });
    //
    //     test("should be able to print a detailed view.", () => {
    //         plot.slots.push(slot);
    //         const correct =
    //             `Plot ${plotNum}:\n  Slot 0:\n    Player: ${slot.player}\n    Plant: ${slot.plant}\n    Reason: ${slot.reason}\n    Started: ${slot.started}\n    Duration: ${slot.duration}\n    Next Queue Size: 0\n  Slot Count: 1\n`;
    //         const result = module.printPlotInfo(plot, plotNum, true);
    //         t.equal(result, correct);
    //     });
    //
    //     test("should trow without a:", () => {
    //         t.throws(() => module.printPlotInfo(null, plotNum, false, 1), InvalidArgumentError, "Plot.");
    //         t.throws(() => module.printPlotInfo(plot, null, false, 1), InvalidArgumentError, "Plot Number.");
    //         t.throws(() => module.printPlotInfo(plot, plotNum, null, 1), InvalidArgumentError, "Detailed.");
    //         t.throws(() => module.printPlotInfo(plot, plotNum, false, null), InvalidArgumentError, "Indent.");
    //     });
    // });
    //
    // test("Print slot info", () => {
    //     const slotNum = 0;
    //
    //     test("should be able to print slot details.", () => {
    //         const correct = `Slot 0:\n  Player: ${slot.player}\n  Plant: ${slot.plant}\n  Reason: ${slot.reason}\n  Started: ${slot.started}\n  Duration: ${slot.duration}\n  Next Queue Size: 0\n`;
    //         const result = module.printSlotInfo(slot, slotNum);
    //         t.equal(result, correct);
    //     });
    //
    //     test("should trow without a:", () => {
    //         t.throws(() => module.printSlotInfo(slot, null, 1), InvalidArgumentError, "Slot Number.");
    //         t.throws(() => module.printSlotInfo(slot, slotNum, null), InvalidArgumentError, "Indent.");
    //     });
    // });
    //
    // test("Slot registering", () => {
    //     const player = "shadowking1243";
    //     const plant = "Test";
    //     const duration = 10;
    //     const reason = Reason.GROWING;
    //     const plotNum = 0;
    //     const slotNum = 0;
    //
    //     test("should be able to assign slot.", () => {
    //         config.plots.push(plot);
    //
    //         await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    //
    //         t.same(config.plots[0].slots[0], new Slot(player, plant, duration, reason, DateTime.now().toUnixInteger()));
    //     });
    //     test("should be able to reserve slot.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    //
    //         t.same(slot.next[0], new Reservation(player, plant, duration, reason));
    //     });
    //     test("should be able to reserve next slot.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //         slot.next.push({} as Reservation);
    //
    //         await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    //
    //         t.same(slot.next[1], new Reservation(player, plant, duration, reason));
    //     });
    //
    //     test("should not be able to overwrite existing reservation.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push({ next: [] } as Slot);
    //
    //         await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    //
    //         t.notSame(plot.slots[0], slot);
    //     });
    //     test("should not be able to overwrite existing next reservation.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //         slot.next.push({} as Reservation);
    //
    //         await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    //
    //         t.notSame(slot.next[0], new Reservation(player, plant, duration, reason));
    //     });
    //
    //     test("should not register a slot without a:", () => {
    //         await t.rejects(module.register(interaction, null, plant, duration, reason, plotNum, slotNum), InvalidArgumentError, "Player Name.");
    //         await t.rejects(module.register(interaction, player, null, duration, reason, plotNum, slotNum), InvalidArgumentError, "Plant Name.");
    //         await t.rejects(module.register(interaction, player, plant, null, reason, plotNum, slotNum), InvalidArgumentError, "Duration.");
    //         await t.rejects(module.register(interaction, player, plant, duration, null, plotNum, slotNum), InvalidArgumentError, "Reason.");
    //         await t.rejects(module.register(interaction, player, plant, duration, reason, null, slotNum), InvalidArgumentError, "Plot Number.");
    //         await t.rejects(module.register(interaction, player, plant, duration, reason, plotNum, null), InvalidArgumentError, "Slot Number.");
    //     });
    // });
    //
    // test("Slot cancellation", () => {
    //     const player = "shadowking124";
    //     const plant = "Test";
    //     const plotNum = 0;
    //     const slotNum = 0;
    //
    //     test.todo("should cancel when correct.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.cancel(interaction, player, plant, plotNum, slotNum);
    //         t.notSame(plot.slots.length, 1);
    //     });
    //     test.todo("should not cancel when the player is wrong.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.cancel(interaction, "wrong", plant, plotNum, slotNum);
    //         t.equal(plot.slots.length, 1);
    //     });
    //     test.todo("should not cancel when the plant is wrong.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.cancel(interaction, player, "wrong", plotNum, slotNum);
    //         t.equal(plot.slots.length, 1);
    //     });
    //     test.todo("should not cancel when the plot number is wrong.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.cancel(interaction, player, plant, 1, slotNum);
    //         t.equal(plot.slots.length, 1);
    //     });
    //     test.todo("should not cancel when the slot number is wrong.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.cancel(interaction, player, plant, plotNum, 1);
    //         t.equal(plot.slots.length, 1);
    //     });
    //
    //     test("should cancel a reservation.", () => {
    //         config.plots.push(plot);
    //         const s: Slot = {
    //             duration: 0, plant: "", player: "", reason: undefined, started: 0,
    //             next: [ new Reservation(player, plant, 0, Reason.NONE) ],
    //         };
    //         plot.slots.push(s);
    //
    //         await module.cancel(interaction, player, plant, 0, 0);
    //         t.equal(s.next.length, 0);
    //     });
    //     test("should not cancel other players reservation.", () => {
    //         config.plots.push(plot);
    //         const reservation = new Reservation(null, null, 0, Reason.NONE);
    //         const s: Slot = {
    //             duration: 0, plant: "", player: "", reason: undefined, started: 0,
    //             next: [
    //                 reservation,
    //                 new Reservation(player, plant, 0, Reason.NONE),
    //             ],
    //         };
    //         plot.slots.push(s);
    //
    //         await module.cancel(interaction, player, plant, 0, 0);
    //         t.equal(s.next.length, 1);
    //         t.same(s.next[0], reservation);
    //     });
    //     test("should cancel the first reservation that matches only.", () => {
    //         config.plots.push(plot);
    //         const reservation = new Reservation(player, plant, 0, Reason.NONE);
    //         const s: Slot = {
    //             duration: 0, plant: "", player: "", reason: undefined, started: 0,
    //             next: [
    //                 new Reservation(player, plant, 0, Reason.NONE),
    //                 reservation,
    //             ],
    //         };
    //         plot.slots.push(s);
    //
    //         await module.cancel(interaction, player, plant, 0, 0);
    //         t.equal(s.next.length, 1);
    //         t.equal(s.next[0], reservation);
    //     });
    //
    //     test("should not cancel without a: ", () => {
    //         await t.rejects(module.cancel(interaction, null, plant, plotNum, slotNum), InvalidArgumentError, "Player.");
    //         await t.rejects(module.cancel(interaction, player, null, plotNum, slotNum), InvalidArgumentError, "Plant.");
    //         await t.rejects(module.cancel(interaction, player, plant, null, slotNum), InvalidArgumentError, "Plot Number.");
    //         await t.rejects(module.cancel(interaction, player, plant, plotNum, null), InvalidArgumentError, "Slot Number.");
    //     });
    // });
    //
    // test("Listing plots and slots", () => {
    //     test("should post a listing of all plots and their information.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //         await module.list(interaction, 0, 0);
    //
    //         const reply = <SinonStub>interaction.reply;
    //
    //         t.ok(reply.called, "Reply message was called.");
    //         t.equal(reply.getCall(0).firstArg, "```\n" + `${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0)}` + "```", "Expected reply");
    //     });
    //     test("should show no plots set message when there are no configured slots.", () => {
    //         await module.list(interaction, 0, 0);
    //
    //         const reply = <SinonStub>interaction.reply;
    //
    //         t.ok(reply.called, "Reply message was called.");
    //         t.strictSame(reply.getCall(0).firstArg, {
    //             content: "No plot and slot information has been set. Kindly contact the management if this is an issue.",
    //             ephemeral: true,
    //         }, "Expected reply");
    //     });
    //
    //     test("should post the information about a plot.", () => {
    //         plot.name = "Fish";
    //         config.plots.push(plot);
    //
    //         await module.list(interaction, 0, null);
    //         t.ok((<SinonStub>interaction.reply).called, "Had the interaction called.");
    //         t.strictSame((<SinonStub>interaction.reply).getCall(0).firstArg, `\`\`\`\n${module.printPlotInfo(plot, 0)}\`\`\``, "Was called with the right options.");
    //     });
    //     test("should post the detailed information about a plot.", () => {
    //         config.plots.push(plot);
    //
    //         options["detailed"] = true;
    //         await module.list(interaction, 0, null);
    //         t.ok((<SinonStub>interaction.reply).called, "Had the interaction called.");
    //         t.strictSame((<SinonStub>interaction.reply).getCall(0).firstArg, `\`\`\`\n${module.printPlotInfo(plot, 0, true)}\`\`\``, "Was called with the right options.");
    //     });
    //
    //     test("should post the information about a slot.", () => {
    //         plot.name = "Fish";
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         await module.list(interaction, 0, 0);
    //         t.ok((<SinonStub>interaction.reply).called, "Had the interaction called.");
    //         t.strictSame((<SinonStub>interaction.reply).getCall(0).firstArg, `\`\`\`\n${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0, 1)}\`\`\``, "Was called with the right options.");
    //     });
    //
    //     test("should post the next reservations.", () => {
    //         plot.name = "Fish";
    //         config.plots.push(plot);
    //         plot.slots.push(slot);
    //
    //         const reservation = new Reservation("shadowking1243", "Test", 10, Reason.GROWING);
    //         slot.next.push(reservation);
    //
    //         await module.list(interaction, 0, 0);
    //         t.ok((<SinonStub>interaction.reply).called, "Had the interaction called.");
    //         t.strictSame((<SinonStub>interaction.reply).getCall(0).firstArg, `\`\`\`\n${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0, 1)}\`\`\``, "Was called with the right options.");
    //     });
    //
    //     test("should post slot unoccupied.", () => {
    //         config.plots.push(plot);
    //         plot.slots.push(null);
    //         plot.slots.push(null);
    //         plot.slots.push(null);
    //
    //         options["detailed"] = true;
    //         await module.list(interaction, 0, null);
    //         t.ok((<SinonStub>interaction.reply).called, "Had the interaction called.");
    //         t.strictSame((<SinonStub>interaction.reply).getCall(0).firstArg, `\`\`\`\n${module.printPlotInfo(plot, 0, true)}\`\`\``, "Was called with the right options.");
    //     });
    //
    //     test("should not post when plot is null.", () => {
    //         config.plots.push(plot);
    //
    //         await module.list(interaction, null, 0);
    //         t.ok((<SinonStub>interaction.reply).called, "Had the interaction called.");
    //         t.strictSame((<SinonStub>interaction.reply).getCall(0).firstArg, {
    //             content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
    //             ephemeral: true,
    //         }, "Was called with the right options.");
    //     });
    // });
    //
    // test("Ticking", () => {
    //     test("should remove slots when time has expired.", () => {
    //         slot.started = DateTime.now().toUnixInteger();
    //         slot.duration = 300;
    //         const slot2 = new Slot("Test", "Test", -3, Reason.GROWING, DateTime.now().toUnixInteger());
    //
    //         plot.slots.push(slot);
    //         plot.slots.push(slot2);
    //         config.plots.push(plot);
    //
    //         await module.tick({ guilds: { cache: { has: () => true } } } as unknown as Client);
    //         t.equal(config.plots[0].slots.length, 2);
    //         t.strictSame(config.plots[0].slots[0], slot);
    //         t.strictSame(config.plots[0].slots[1], null);
    //     });
    //     test("should remove slots and set next when time has expired.", () => {
    //         const reservation = new Reservation("Test", "Test", 400, Reason.GROWING);
    //         const newSlot = new Slot(reservation.player, reservation.plant, reservation.duration, reservation.reason, DateTime.now().toUnixInteger());
    //
    //         slot.started = DateTime.now().toUnixInteger();
    //         slot.duration = -3;
    //
    //         slot.next.push(reservation);
    //         plot.slots.push(slot);
    //         config.plots.push(plot);
    //
    //         await module.tick({ guilds: { cache: { has: () => true } } } as unknown as Client);
    //         t.equal(config.plots[0].slots[0].next.length, 0);
    //         t.strictSame(config.plots[0].slots[0], newSlot);
    //     });
    //
    //     test("should post message when reservation has expired.", () => {
    //         const reservation = new Reservation("Test", "Test", 400, Reason.GROWING);
    //         const newSlot = new Slot(reservation.player, reservation.plant, reservation.duration, reservation.reason, DateTime.now().toUnixInteger());
    //
    //         slot.started = DateTime.now().toUnixInteger();
    //         slot.duration = -3;
    //
    //         slot.next.push(reservation);
    //         plot.slots.push(slot);
    //         config.plots.push(plot);
    //
    //         await module.tick({ guilds: { cache: { has: () => true } } } as unknown as Client);
    //         t.equal(config.plots[0].slots[0].next.length, 0);
    //         t.strictSame(config.plots[0].slots[0], newSlot);
    //
    //         t.ok(mockedFunction.called, "Function was called.");
    //     });
    // });

    describe("Posting channel message", () => {
        test.todo("should post message in correct channel when called.");
    });

    describe("Sub command resolver", () => {
        test.todo("should call the correct function when subcommand is provided.");
        test.todo("should provide all the necessary argument to each function.");
    });
});