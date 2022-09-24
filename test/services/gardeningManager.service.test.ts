import "reflect-metadata";

import { jest } from "@jest/globals";
import { CommandInteraction } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { container, singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../../src/utils/config/databaseConfigurationService.js";
import { createLogger } from "../../src/utils/logger/logger.decorator.js";
import { Client } from "../../src/utils/models/client.js";
import { InvalidArgumentError } from "../../src/utils/models/errors.js";
import { MockDatabase } from "../utils/mockDatabase.js";
import { GardeningManagerService } from "../../src/services/gardeningManager.service.js";
import { GardeningManagerRepository } from "../../src/repositories/gardeningManager.repository.js";
import { GardeningModuleConfig, Plot, Slot, Reason, Reservation } from "../../src/models/gardening_manager/index.js";

@singleton()
class MockModule extends GardeningManagerService {
    constructor(gardeningConfigRepository: GardeningManagerRepository, @createLogger(GardeningManagerService.name) logger: pino.Logger) {
        super(gardeningConfigRepository, logger);
    }

    public postChannelMessage = jest.fn() as any;

    public validatePlotAndSlot(interaction: CommandInteraction, config: GardeningModuleConfig, plotNum: number, slotNum: number, slotShouldExist = true) {
        return GardeningManagerService.validatePlotAndSlot(interaction, config, plotNum, slotNum, slotShouldExist);
    }

    public printPlotInfo(plot: Plot, plotNum: number, detailed = false, indent = 1) {
        return GardeningManagerService.printPlotInfo(plot, plotNum, detailed, indent);
    }

    public printSlotInfo(slot: Slot, slotNum: number, indent = 1) {
        return GardeningManagerService.printSlotInfo(slot, slotNum, indent);
    }
}

describe("The garden service's", () => {
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

    const mockDb: MockDatabase = container.registerSingleton(DatabaseConfigurationService, MockDatabase).resolve(DatabaseConfigurationService) as MockDatabase;
    const module: MockModule = container.resolve(MockModule);

    let options = {};

    const interaction = {
        reply: jest.fn(),
        client: {},
        member: { displayName: "", displayAvatarURL: () => "" },
        options: { getBoolean: (key: string) => { return options[key] ?? null; } },
    } as unknown as CommandInteraction;

    beforeAll(() => jest.useFakeTimers());
    afterAll(() => jest.useRealTimers());

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
        mockDb.config = config;
        (interaction.reply as jest.Mock).mockReset();
        (module.postChannelMessage as jest.Mock).mockReset();
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

        describe("should throw when argument", () => {
            test("plotNum is null.", async () => await expect(module.validatePlotAndSlot(interaction, config, null, slotNum)).rejects.toThrow(InvalidArgumentError));
            test("slotNum is null.", async () => await expect(module.validatePlotAndSlot(interaction, config, plotNum, null)).rejects.toThrow(InvalidArgumentError));
            test("slotShouldExist is null.", async () => await expect(module.validatePlotAndSlot(interaction, config, plotNum, slotNum, null)).rejects.toThrow(InvalidArgumentError));
        });
    });

    describe("Print plot info", () => {
        const plotNum = 0;

        test("should be able to print a basic view.", () => {
            plot.slots.push(slot);
            const correct = `Plot ${plotNum}:\n  Slot Count: 1\n`;
            const result = module.printPlotInfo(plot, plotNum, false);
            expect(result).toBe(correct);
        });

        test("should be able to print a detailed view.", () => {
            plot.slots.push(slot);
            const correct =
                `Plot ${plotNum}:\n  Slot 0:\n    Player: ${slot.player}\n    Plant: ${slot.plant}\n    Reason: ${slot.reason}\n    Started: ${slot.started}\n    Duration: ${slot.duration}\n    Next Queue Size: 0\n  Slot Count: 1\n`;
            const result = module.printPlotInfo(plot, plotNum, true);
            expect(result).toBe(correct);
        });

        test("should trow without a:", () => {
            expect(() => module.printPlotInfo(null, plotNum, false, 1)).toThrow(InvalidArgumentError);
            expect(() => module.printPlotInfo(plot, null, false, 1)).toThrow(InvalidArgumentError);
            expect(() => module.printPlotInfo(plot, plotNum, null, 1)).toThrow(InvalidArgumentError);
            expect(() => module.printPlotInfo(plot, plotNum, false, null)).toThrow(InvalidArgumentError);
        });
    });

    describe("Print slot info", () => {
        const slotNum = 0;

        test("should be able to print slot details.", () => {
            const correct = `Slot 0:\n  Player: ${slot.player}\n  Plant: ${slot.plant}\n  Reason: ${slot.reason}\n  Started: ${slot.started}\n  Duration: ${slot.duration}\n  Next Queue Size: 0\n`;
            const result = module.printSlotInfo(slot, slotNum);
            expect(result).toBe(correct);
        });

        test("should trow without a:", () => {
            expect(() => module.printSlotInfo(slot, null, 1)).toThrow(InvalidArgumentError);
            expect(() => module.printSlotInfo(slot, slotNum, null)).toThrow(InvalidArgumentError);
        });
    });

    describe("Slot registering", () => {
        const player = "shadowking1243";
        const plant = "Test";
        const duration = 10;
        const reason = Reason.GROWING;
        const plotNum = 0;
        const slotNum = 0;

        test("should be able to assign slot.", async () => {
            config.plots.push(plot);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            expect(config.plots[0].slots[0]).toEqual(new Slot(player, plant, duration, reason, DateTime.now().toUnixInteger()));
        });
        test("should be able to reserve slot.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            expect(slot.next[0]).toEqual(new Reservation(player, plant, duration, reason));
        });
        test("should be able to reserve next slot.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);
            slot.next.push({} as Reservation);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            expect(slot.next[1]).toEqual(new Reservation(player, plant, duration, reason));
        });

        test("should not be able to overwrite existing reservation.", async () => {
            config.plots.push(plot);
            plot.slots.push({ next: [] } as Slot);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            expect(plot.slots[0]).not.toEqual(slot);
        });
        test("should not be able to overwrite existing next reservation.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);
            slot.next.push({} as Reservation);

            await module.register(interaction, player, plant, duration, reason, plotNum, slotNum);

            expect(slot.next[0]).not.toEqual(new Reservation(player, plant, duration, reason));
        });

        test("should not register a slot without a:", async () => {
            await expect(module.register(interaction, null, plant, duration, reason, plotNum, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.register(interaction, player, null, duration, reason, plotNum, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.register(interaction, player, plant, null, reason, plotNum, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.register(interaction, player, plant, duration, null, plotNum, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.register(interaction, player, plant, duration, reason, null, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.register(interaction, player, plant, duration, reason, plotNum, null)).rejects.toThrow(InvalidArgumentError);
        });
    });

    describe("Slot cancellation", () => {
        const player = "Shadowking124";
        const plant = "Test";
        const plotNum = 0;
        const slotNum = 0;

        test("should cancel when correct.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, plant, plotNum, slotNum);
            expect(plot.slots.filter(value => !!value).length).not.toEqual(1);
        });
        test("should not cancel when the player is wrong.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, "wrong", plant, plotNum, slotNum);
            expect(plot.slots.length).toBe(1);
        });
        test("should not cancel when the plant is wrong.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, "wrong", plotNum, slotNum);
            expect(plot.slots.length).toBe(1);
        });
        test("should not cancel when the plot number is wrong.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, plant, 1, slotNum);
            expect(plot.slots.length).toBe(1);
        });
        test("should not cancel when the slot number is wrong.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.cancel(interaction, player, plant, plotNum, 1);
            expect(plot.slots.length).toBe(1);
        });

        test("should cancel a reservation.", async () => {
            config.plots.push(plot);
            const s: Slot = {
                duration: 0, plant: "", player: "", reason: undefined, started: 0,
                next: [ new Reservation(player, plant, 0, Reason.NONE) ],
            };
            plot.slots.push(s);

            await module.cancel(interaction, player, plant, 0, 0);
            expect(s.next.length).toBe(0);
        });
        test("should not cancel other players reservation.", async () => {
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
            expect(s.next.length).toBe(1);
            expect(s.next[0]).toEqual(reservation);
        });
        test("should cancel the first reservation that matches only.", async () => {
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
            expect(s.next.length).toBe(1);
            expect(s.next[0]).toBe(reservation);
        });

        test("should not cancel without a: ", async () => {
            await expect(module.cancel(interaction, null, plant, plotNum, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.cancel(interaction, player, null, plotNum, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.cancel(interaction, player, plant, null, slotNum)).rejects.toThrow(InvalidArgumentError);
            await expect(module.cancel(interaction, player, plant, plotNum, null)).rejects.toThrow(InvalidArgumentError);
        });
    });

    describe("Listing plots and slots", () => {
        test("should post a listing of all plots and their information.", async () => {
            config.plots.push(plot);
            plot.slots.push(slot);
            await module.list(interaction, 0, 0);

            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith("```\n" + `${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0)}` + "```");
        });
        test("should show no plots set message when there are no configured slots.", async () => {
            await module.list(interaction, 0, 0);

            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith({
                content: "No plot and slot information has been set. Kindly contact the management if this is an issue.",
                ephemeral: true,
            });
        });

        test("should post the information about a plot.", async () => {
            plot.name = "Fish";
            config.plots.push(plot);

            await module.list(interaction, 0, null);
            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith(`\`\`\`\n${module.printPlotInfo(plot, 0)}\`\`\``);
        });
        test("should post the detailed information about a plot.", async () => {
            config.plots.push(plot);

            options["detailed"] = true;
            await module.list(interaction, 0, null);
            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith(`\`\`\`\n${module.printPlotInfo(plot, 0, true)}\`\`\``);
        });

        test("should post the information about a slot.", async () => {
            plot.name = "Fish";
            config.plots.push(plot);
            plot.slots.push(slot);

            await module.list(interaction, 0, 0);
            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith(`\`\`\`\n${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0, 1)}\`\`\``);
        });

        test("should post the next reservations.", async () => {
            plot.name = "Fish";
            config.plots.push(plot);
            plot.slots.push(slot);

            const reservation = new Reservation("shadowking1243", "Test", 10, Reason.GROWING);
            slot.next.push(reservation);

            await module.list(interaction, 0, 0);
            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith(`\`\`\`\n${module.printPlotInfo(plot, 0)}${module.printSlotInfo(slot, 0, 1)}\`\`\``);
        });

        test("should post slot unoccupied.", async () => {
            config.plots.push(plot);
            plot.slots.push(null);
            plot.slots.push(null);
            plot.slots.push(null);

            options["detailed"] = true;
            await module.list(interaction, 0, null);
            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith(`\`\`\`\n${module.printPlotInfo(plot, 0, true)}\`\`\``);
        });

        test("should not post when plot is null.", async () => {
            config.plots.push(plot);

            await module.list(interaction, null, 0);
            expect(interaction.reply).toBeCalled();
            expect(interaction.reply).toBeCalledWith({
                content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
                ephemeral: true,
            });
        });
    });

    describe("Ticking", () => {
        test("should remove slots when time has expired.", async () => {
            slot.started = DateTime.now().toUnixInteger();
            slot.duration = 300;
            const slot2 = new Slot("Test", "Test", -3, Reason.GROWING, DateTime.now().toUnixInteger());

            plot.slots.push(slot);
            plot.slots.push(slot2);
            config.plots.push(plot);

            await module.tick({ guilds: { cache: { has: () => true } } } as unknown as Client);
            expect(config.plots[0].slots.length).toBe(2);
            expect(config.plots[0].slots[0]).toEqual(slot);
            expect(config.plots[0].slots[1]).toBeNull();
        });
        test("should remove slots and set next when time has expired.", async () => {
            const reservation = new Reservation("Test", "Test", 400, Reason.GROWING);
            const newSlot = new Slot(reservation.player, reservation.plant, reservation.duration, reservation.reason, DateTime.now().toUnixInteger());

            slot.started = DateTime.now().toUnixInteger();
            slot.duration = -3;

            slot.next.push(reservation);
            plot.slots.push(slot);
            config.plots.push(plot);

            await module.tick({ guilds: { cache: { has: () => true } } } as unknown as Client);
            expect(config.plots[0].slots[0].next.length).toBe(0);
            expect(config.plots[0].slots[0]).toEqual(newSlot);
        });

        test("should post message when reservation has expired.", async () => {
            const reservation = new Reservation("Test", "Test", 400, Reason.GROWING);
            const newSlot = new Slot(reservation.player, reservation.plant, reservation.duration, reservation.reason, DateTime.now().toUnixInteger());

            slot.started = DateTime.now().toUnixInteger();
            slot.duration = -3;

            slot.next.push(reservation);
            plot.slots.push(slot);
            config.plots.push(plot);

            await module.tick({ guilds: { cache: { has: () => true } } } as unknown as Client);
            expect(config.plots[0].slots[0].next.length).toBe(0);
            expect(config.plots[0].slots[0]).toEqual(newSlot);

            expect(module.postChannelMessage).toBeCalled();
        });
    });

    describe("Posting channel message", () => {
        test.todo("should post message in correct channel when called.");
    });

    describe("Sub command resolver", () => {
        test.todo("should call the correct function when subcommand is provided.");
        test.todo("should provide all the necessary argument to each function.");
    });
});