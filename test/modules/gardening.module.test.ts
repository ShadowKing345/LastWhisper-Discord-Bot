import "reflect-metadata";

import {CommandInteraction} from "discord.js";
import {DateTime} from "luxon";
import {fake, SinonStub, useFakeTimers} from "sinon";
import {test} from "tap";
import {container} from "tsyringe";

import {Database} from "../../src/config/databaseConfiguration.js";
import {Plot, Reason, Reservation, Slot} from "../../src/models/gardeningConfig.model.js";
import {GardeningModule} from "../../src/modules/gardening.module.js";
import {InvalidArgumentError} from "../../src/utils/errors.js";

test("Gardening Module Tests:", async t => {
    let clock;

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
        slots: [slot],
    };
    let config = {
        _id: undefined,
        guildId: "",
        messagePostingChannelId: "",
        plots: [plot],
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
                    find: async () => [config],
                    replaceOne: async (obj) => {
                        Object.assign(config, obj);
                        return config;
                    },
                };
            },
        } as unknown as Database,
    });
    const module = container.resolve(GardeningModule);

    const interaction = {reply: fake()} as unknown as CommandInteraction;

    t.before(() => clock = useFakeTimers());
    t.teardown(() => clock.restore());

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
    });

    await t.test("Validation of Plots and Slots", async t => {
        const plotNum = 0;
        const slotNum = 0;

        await t.test("should be able to get plot and slot.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            const result = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            t.ok(result, "Is not null.");
            t.same(result[0], plot, "Same plot.");
            t.same(result[1], slot, "Same slot.");
        });
        await t.test("should return void when no plots.", async t => {
            const result = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            t.notOk(result, "Is null.");
            t.ok((<SinonStub>interaction.reply).called, "Interaction was called.");
            t.ok((<SinonStub>interaction.reply).calledWith({
                content: `Sorry but the plot number has to be from 0 to ${config.plots.length - 1}.`,
                ephemeral: true,
            }), "Called with correct message.");
        });
        await t.test("should return void when no slots.", async t => {
            config.plots.push(plot);

            const result = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum, true);
            t.notOk(result, "Is null.");
            t.ok((<SinonStub>interaction.reply).called, "Interaction was called.");
            t.ok((<SinonStub>interaction.reply).calledWith({
                content: `Sorry but the slot number has to be from 0 to ${plot.slots.length}.`,
                ephemeral: true,
            }), "Called with correct message.");
        });
        await t.test("should return plot and null when no slots and slot should exist is false.", async t => {
            config.plots.push(plot);

            const result = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum, false);
            t.ok(result, "Is not null.");
            t.same(result[0], plot, "Same plot.");
            t.notOk(result[1], "Slot is null.");
        });

        await t.test("should throw when argument is null:", async t => {
            await t.rejects(GardeningModule.validatePlotAndSlot(interaction, config, null, slotNum), InvalidArgumentError, "Plot Number.");
            await t.rejects(GardeningModule.validatePlotAndSlot(interaction, config, plotNum, null), InvalidArgumentError, "Slot Number.");
            await t.rejects(GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum, null), InvalidArgumentError, "Slot Should Exist.");
        });
    });

    await t.todo("Print plot info");
    await t.todo("Print slot info");

    await t.test("Slot registering", async t => {
        const player = "shadowking1243";
        const plant = "Test";
        const duration = 10;
        const reason = Reason.GROWING;
        const plotNum = 0;
        const slotNum = 0;

        await t.test("should be able to assign slot.", async t => {
            config.plots.push(plot);

            await module.register(interaction, config, player, plant, duration, reason, plotNum, slotNum);

            t.same(config.plots[0].slots[0], new Slot(player, plant, duration, reason, DateTime.now().toUnixInteger()));
        });
        await t.test("should be able to reserve slot.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.register(interaction, config, player, plant, duration, reason, plotNum, slotNum);

            t.same(slot.next[0], new Reservation(player, plant, duration, reason));
        });
        await t.test("should be able to reserve next slot.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);
            slot.next.push({} as Reservation);

            await module.register(interaction, config, player, plant, duration, reason, plotNum, slotNum);

            t.same(slot.next[1], new Reservation(player, plant, duration, reason));
        });

        await t.test("should not be able to overwrite existing reservation.", async t => {
            config.plots.push(plot);
            plot.slots.push({next: []} as Slot);

            await module.register(interaction, config, player, plant, duration, reason, plotNum, slotNum);

            t.notSame(plot.slots[0], slot);
        });
        await t.test("should not be able to overwrite existing next reservation.", async t => {
            config.plots.push(plot);
            plot.slots.push(slot);
            slot.next.push({} as Reservation);

            await module.register(interaction, config, player, plant, duration, reason, plotNum, slotNum);

            t.notSame(slot.next[0], new Reservation(player, plant, duration, reason));
        });

        await t.test("should not register a slot without a:", async t => {
            await t.rejects(module.register(interaction, config, null, plant, duration, reason, plotNum, slotNum), InvalidArgumentError, "Player Name.");
            await t.rejects(module.register(interaction, config, player, null, duration, reason, plotNum, slotNum), InvalidArgumentError, "Plant Name.");
            await t.rejects(module.register(interaction, config, player, plant, null, reason, plotNum, slotNum), InvalidArgumentError, "Duration.");
            await t.rejects(module.register(interaction, config, player, plant, duration, null, plotNum, slotNum), InvalidArgumentError, "Reason.");
            await t.rejects(module.register(interaction, config, player, plant, duration, reason, null, slotNum), InvalidArgumentError, "Plot Number.");
            await t.rejects(module.register(interaction, config, player, plant, duration, reason, plotNum, null), InvalidArgumentError, "Slot Number.");
        });
    });

    await t.test("Slot cancellation", async t => {
        const player = "shadowking124";
        const plant = "Test";
        const plotNum = 0;
        const slotNum = 0;

        await t.todo("should cancel when correct.");
        await t.todo("should not cancel when the player is wrong.");
        await t.todo("should not cancel when the plant is wrong.");
        await t.todo("should not cancel when the plot number is wrong.");
        await t.todo("should not cancel when the slot number is wrong.");

        await t.todo("should not cancel other players reservation.");
        await t.todo("should cancel the first reservation that matches only.");

        await t.test("should not cancel without a: ", async t => {
            await t.rejects(module.cancel(interaction, config, null, plant, plotNum, slotNum), InvalidArgumentError, "Player.");
            await t.rejects(module.cancel(interaction, config, player, null, plotNum, slotNum), InvalidArgumentError, "Plant.");
            await t.rejects(module.cancel(interaction, config, player, plant, null, slotNum), InvalidArgumentError, "Plot Number.");
            await t.rejects(module.cancel(interaction, config, player, plant, plotNum, null), InvalidArgumentError, "Slot Number.");
        });
    });

    await t.todo("Listing plots and slots");
    await t.todo("Ticking");
    await t.todo("Posting channel message");
    await t.todo("Sub command resolver");
});