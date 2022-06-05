import "reflect-metadata";

import { CommandInteraction } from "discord.js";
import { DateTime } from "luxon";
import { createSandbox, fake, SinonFakeTimers, SinonSandbox, SinonSpy, SinonStub, useFakeTimers } from "sinon";
import { test } from "tap";
import { ImportMock } from "ts-mock-imports";
import { container, injectable } from "tsyringe";

import { Database } from "../../src/config/databaseConfiguration.js";
import { GardeningConfig, Plot, Reason, Reservation, Slot } from "../../src/models/gardeningConfig.model.js";
import { GardeningManagerService } from "../../src/services/gardeningManager.service.js";
import { InvalidArgumentError } from "../../src/utils/errors.js";

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

test("Gardening Module Tests:", async t => {
    let clock: SinonFakeTimers;
    let sandbox: SinonSandbox;

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

    container.register<Database>(Database, {
        useValue: {
            collection: () => {
                return {
                    findOneAndReplace: async (_, obj) => {
                        Object.assign(config, obj);
                        return config;
                    },
                    findOne: async () => config,
                    find: async () => [ config ],
                    replaceOne: async (obj) => {
                        Object.assign(config, obj);
                        return config;
                    },
                };
            },
        } as unknown as Database,
    });
    const module = container.resolve(MockModule);

    const options = {};

    const interaction = {
        reply: fake(),
        client: {},
        member: { displayName: "", displayAvatarURL: () => "" },
        options: {
            getBoolean: (key: string) => {
                return options[key] ?? null;
            },
        },
    } as unknown as CommandInteraction;

    t.before(() => {
        clock = useFakeTimers();
        sandbox = createSandbox();
    });
    t.teardown(() => {
        clock.restore();
        sandbox.restore();
    });

    t.beforeEach(() => {
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
        (<SinonSpy> interaction.reply).resetHistory();
        sandbox.reset();
    });

    await t.test("Validation of Plots and Slots", async t => {
        const plotNum = 0;
        const slotNum = 0;

        await t.test("should be able to get plot and slot.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            t.ok(result, "Is not null.");
            t.same(result[0], plot, "Same plot.");
            t.same(result[1], slot, "Same slot.");
        });
        await t.test("should return void when no plots.", async t => {
            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            t.notOk(result, "Is null.");
            t.ok((<SinonStub> interaction.reply).called, "Interaction was called.");
            t.ok((<SinonStub> interaction.reply).calledWith({
                content: `Sorry but the plot number has to be from 0 to ${config.plots.length - 1}.`,
                ephemeral: true,
            }), "Called with correct message.");
        });
        await t.test("should return void when no slots.", async t => {
            config.plots.push(plot);

            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            t.notOk(result, "Is null.");
            t.ok((<SinonStub> interaction.reply).called, "Interaction was called.");
            t.ok((<SinonStub> interaction.reply).calledWith({
                content: `Sorry but the slot number has to be from 0 to ${plot.slots.length}.`,
                ephemeral: true,
            }), "Called with correct message.");
        });
        await t.test("should return plot and null when no slots and slot should exist is false.", async t => {
            config.plots.push(plot);

            const result = await module.validatePlotAndSlot(interaction, config, plotNum, slotNum, false);
            t.ok(result, "Is not null.");
            t.same(result[0], plot, "Same plot.");
            t.notOk(result[1], "Slot is null.");
        });

        await t.test("should throw when argument is null:", async t => {
            await t.rejects(module.validatePlotAndSlot(interaction, config, null, slotNum), InvalidArgumentError, "Plot Number.");
            await t.rejects(module.validatePlotAndSlot(interaction, config, plotNum, null), InvalidArgumentError, "Slot Number.");
            await t.rejects(module.validatePlotAndSlot(interaction, config, plotNum, slotNum, null), InvalidArgumentError, "Slot Should Exist.");
        });
    });

    await t.test("Print plot info", async t => {
        const plotNum = 0;

        await t.test("should be able to print a basic view.", async t => {
            plot.slots.push(slot);
            const correct = `Plot ${plotNum}:\n  Slot Count: 1\n`;
            const result = module.printPlotInfo(plot, plotNum, false);
            t.equal(result, correct);
        });

        await t.test("should be able to print a detailed view.", async t => {
            plot.slots.push(slot);
            const correct =
                `Plot ${plotNum}:\n  Slot 0:\n    Player: ${slot.player}\n    Plant: ${slot.plant}\n    Reason: ${slot.reason}\n    Started: ${slot.started}\n    Duration: ${slot.duration}\n    Next Queue Size: 0\n  Slot Count: 1\n`;
            const result = module.printPlotInfo(plot, plotNum, true);
            t.equal(result, correct);
        });

        await t.test("should trow without a:", async t => {
            t.throws(() => module.printPlotInfo(null, plotNum, false, 1), InvalidArgumentError, "Plot.");
            t.throws(() => module.printPlotInfo(plot, null, false, 1), InvalidArgumentError, "Plot Number.");
            t.throws(() => module.printPlotInfo(plot, plotNum, null, 1), InvalidArgumentError, "Detailed.");
            t.throws(() => module.printPlotInfo(plot, plotNum, false, null), InvalidArgumentError, "Indent.");
        });
    });

    await t.test("Print slot info", async t => {
        const slotNum = 0;

        await t.test("should be able to print slot details.", async t => {
            const correct = `Slot 0:\n  Player: ${slot.player}\n  Plant: ${slot.plant}\n  Reason: ${slot.reason}\n  Started: ${slot.started}\n  Duration: ${slot.duration}\n  Next Queue Size: 0\n`;
            const result = module.printSlotInfo(slot, slotNum);
            t.equal(result, correct);
        });

        await t.test("should trow without a:", async t => {
            t.throws(() => module.printSlotInfo(null, slotNum, 1), InvalidArgumentError, "Slot.");
            t.throws(() => module.printSlotInfo(slot, null, 1), InvalidArgumentError, "Slot Number.");
            t.throws(() => module.printSlotInfo(slot, slotNum, null), InvalidArgumentError, "Indent.");
        });
    });

    await t.test("Slot registering", async t => {
        let mockedFunction: SinonStub;

        t.before(() => {
            mockedFunction = ImportMock.mockFunction(module, "postChannelMessage", null);
        });

        t.teardown(() => {
            mockedFunction?.reset();
        });

        const player = "shadowking1243";
        const plant = "Test";
        const duration = 10;
        const reason = Reason.GROWING;
        const plotNum = 0;
        const slotNum = 0;

        await t.test("should be able to assign slot.", async t => {
            config.plots.push(plot);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            t.same(config.plots[0].slots[0], new Slot(player, plant, duration, reason, DateTime.now().toUnixInteger()));
        });
        await t.test("should be able to reserve slot.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            t.same(slot.next[0], new Reservation(player, plant, duration, reason));
        });
        await t.test("should be able to reserve next slot.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);
            slot.next.push({} as Reservation);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            t.same(slot.next[1], new Reservation(player, plant, duration, reason));
        });

        await t.test("should not be able to overwrite existing reservation.", async t => {
            config.plots.push(plot);
            plot.slots.push({ next: [] } as Slot);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            t.notSame(plot.slots[0], slot);
        });
        await t.test("should not be able to overwrite existing next reservation.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);
            slot.next.push({} as Reservation);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            t.notSame(slot.next[0], new Reservation(player, plant, duration, reason));
        });

        await t.test("should not register a slot without a:", async t => {
            await t.rejects(module.register(interaction, null, plant, duration, reason, plotNum, slotNum), InvalidArgumentError, "Player Name.");
            await t.rejects(module.register(interaction, player, null, duration, reason, plotNum, slotNum), InvalidArgumentError, "Plant Name.");
            await t.rejects(module.register(interaction, player, plant, null, reason, plotNum, slotNum), InvalidArgumentError, "Duration.");
            await t.rejects(module.register(interaction, player, plant, duration, null, plotNum, slotNum), InvalidArgumentError, "Reason.");
            await t.rejects(module.register(interaction, player, plant, duration, reason, null, slotNum), InvalidArgumentError, "Plot Number.");
            await t.rejects(module.register(interaction, player, plant, duration, reason, plotNum, null), InvalidArgumentError, "Slot Number.");
        });
    });

    await t.test("Slot cancellation", async t => {
        const player = "shadowking124";
        const plant = "Test";
        const plotNum = 0;
        const slotNum = 0;

        await t.todo("should cancel when correct.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, plant, plotNum, slotNum);
            t.notSame(plot.slots.length, 1);
        });
        await t.todo("should not cancel when the player is wrong.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, "wrong", plant, plotNum, slotNum);
            t.equal(plot.slots.length, 1);
        });
        await t.todo("should not cancel when the plant is wrong.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, "wrong", plotNum, slotNum);
            t.equal(plot.slots.length, 1);
        });
        await t.todo("should not cancel when the plot number is wrong.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, plant, 1, slotNum);
            t.equal(plot.slots.length, 1);
        });
        await t.todo("should not cancel when the slot number is wrong.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, plant, plotNum, 1);
            t.equal(plot.slots.length, 1);
        });

        await t.test("should cancel a reservation.", async t => {
            config.plots.push(plot);
            const s: Slot = {
                duration: 0, plant: "", player: "", reason: undefined, started: 0,
                next: [ new Reservation(player, plant, 0, Reason.NONE) ],
            };
            plot.slots.push(s);

            await module.cancel(interaction, player, plant, 0, 0);
            t.equal(s.next.length, 0);
        });
        await t.test("should not cancel other players reservation.", async t => {
            config.plots.push(plot);
            const reservation = new Reservation(null, null, 0, Reason.NONE);
            const s: Slot = {
                duration: 0, plant: "", player: "", reason: undefined, started: 0,
                next: [
                    reservation,
                    new Reservation(player, plant, 0, Reason.NONE),
                ],
            };
            plot.slots.push(s);

            await module.cancel(interaction, player, plant, 0, 0);
            t.equal(s.next.length, 1);
            t.same(s.next[0], reservation);
        });
        await t.test("should cancel the first reservation that matches only.", async t => {
            config.plots.push(plot);
            const reservation = new Reservation(player, plant, 0, Reason.NONE);
            const s: Slot = {
                duration: 0, plant: "", player: "", reason: undefined, started: 0,
                next: [
                    new Reservation(player, plant, 0, Reason.NONE),
                    reservation,
                ],
            };
            plot.slots.push(s);

            await module.cancel(interaction, player, plant, 0, 0);
            t.equal(s.next.length, 1);
            t.equal(s.next[0], reservation);
        });

        await t.test("should not cancel without a: ", async t => {
            await t.rejects(module.cancel(interaction, null, plant, plotNum, slotNum), InvalidArgumentError, "Player.");
            await t.rejects(module.cancel(interaction, player, null, plotNum, slotNum), InvalidArgumentError, "Plant.");
            await t.rejects(module.cancel(interaction, player, plant, null, slotNum), InvalidArgumentError, "Plot Number.");
            await t.rejects(module.cancel(interaction, player, plant, plotNum, null), InvalidArgumentError, "Slot Number.");
        });
    });

    await t.test("Listing plots and slots", async t => {
        await t.test("should post a listing of all plots and their information.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);
            await module.list(interaction, 0, 0);

            const reply = <SinonStub> interaction.reply;

            t.ok(reply.called, "Reply message was called.");
            t.equal(reply.getCall(0).firstArg, "```\n" + `${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0)}` + "```", "Expected reply");
        });
        await t.test("should show no plots set message when there are no configured slots.", async t => {
            await module.list(interaction, 0, 0);

            const reply = <SinonStub> interaction.reply;

            t.ok(reply.called, "Reply message was called.");
            t.equal(reply.getCall(0).firstArg, {
                content: "No plot and slot information has been set. Kindly contract the management if this is an issue.",
                ephemeral: true,
            }, "Expected reply");
        });

        await t.todo("should post the information about a plot.");
        await t.todo("should post the detailed information about a plot.");

        await t.todo("should post the information about a slot.");
        await t.todo("should post the detailed information about a slot.");

        await t.todo("should post the next reservations.");

        await t.todo("should post slot unoccupied.");

        await t.test("should not post when plot is null. ", async t => {
            await module.list(interaction, null, 0);
            t.ok((<SinonStub> interaction.reply).called, "Had the interaction called.");
            t.ok((<SinonStub> interaction.reply).calledWith({
                content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
                ephemeral: true,
            }), "Was called with the right options.");
        });
    });

    await t.test("Ticking", async t => {
        await t.todo("should remove slots when time has expired.");
        await t.todo("should remove slots and set next when time has expired.");

        await t.todo("should post message when reservation has expired.");
    });

    await t.test("Posting channel message", async t => {
        await t.todo("should post message in correct channel when called.");
    });

    await t.test("Sub command resolver", async t => {
        await t.todo("should call the correct function when subcommand is provided.");
        await t.todo("should provide all the necessary argument to each function.");
    });
});