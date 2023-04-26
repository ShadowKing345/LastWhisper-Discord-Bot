import { EventManagerSettingsRepository } from "../../src/repositories/eventManager/eventManagerSettingsRepository.js";
import { EventManagerService } from "../../src/services/eventManager.js";
import { EventObjectRepository } from "../../src/repositories/eventManager/eventObjectRepository.js";
import { EventReminderRepository } from "../../src/repositories/eventManager/eventReminderRepository.js";
import { DateTime } from "luxon";
import { test, mock } from "node:test";
import Assert from "node:assert";
import { mockRepository } from "../utils/mockRepository.js";
import { EventManagerSettings } from "../../src/entities/eventManager/index.js";
import { ChannelType, Client } from "discord.js";
import { EventObject, EventReminder } from "../../src/entities/eventManager/index.js";

const _ = mock.fn<() => Promise<unknown>>( () => Promise.resolve() );
type MockFunction = typeof _;

test( "Testing the parser.", async t => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository );
    const eventObjRepo = mockRepository( EventObjectRepository );
    const reminderRepo = mockRepository( EventReminderRepository );

    t.beforeEach( () => {
        settingsRepo._clear();
        eventObjRepo._clear();
        reminderRepo._clear();
    } );

    await t.test( "Message got parsed correctly.", async () => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        } ) );
        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );

        const result = await service.parseEvent( "0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ DateTime.now().plus( { days: 1 } ).toUnixInteger() }:f>` );
        Assert.ok( result );
        Assert.ok( result?.isValid );
    } );

    await t.test( "Message is wrong", async () => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        } ) );
        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
        const now = DateTime.now().plus( { days: 1 } ).toUnixInteger();

        Assert.ok( !( await service.parseEvent( "0", `[description]\nTesting\n[time]\n<t:${ now }:f>` ) ).isValid, "Bad event name" )
        Assert.ok( !( await service.parseEvent( "0", `[announcement]\nHello World\n[time]\n<t:${ now }:f>` ) ).isValid, "Bad event description" )
        Assert.ok( !( await service.parseEvent( "0", `[announcement]\nHello World\n[description]\nTesting` ) ).isValid, "Bad time" )
        Assert.ok( !( await service.parseEvent( "0", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ 0 }:f>` ) ).isValid, "Time is before now" );
    } );
} ).catch( console.error );

test( "Event was successfully created.", async t => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository );
    const eventObjRepo = mockRepository( EventObjectRepository );
    const reminderRepo = mockRepository( EventReminderRepository );

    const now = DateTime.now().plus( { days: 1 } ).toUnixInteger();

    const expectedObj = new EventObject( {
        guildId: "0",
        name: "Hello World",
        description: "Testing",
        dateTime: now
    } );

    t.beforeEach( () => {
        settingsRepo._clear();
        eventObjRepo._clear();
        reminderRepo._clear();
    } );

    await t.test( "Saved a new event with text.", async () => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
        
        await service.create( "0", null, `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>` );
        Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );

        const result = (( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown>)[0];
        Assert.deepStrictEqual( result, expectedObj );
    } );
    
    // Todo: Use one function for creating with arguments or creating with text.
    // await t.test( "Saved a new event with arguments.", async () => {
    //     settingsRepo._addItem( "0", new EventManagerSettings( {
    //         guildId: "0",
    //         listenerChannelId: "1",
    //         announcement: "announcement",
    //         description: "description",
    //         dateTime: "time",
    //     } ) );
    //
    //     const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
    //    
    //     await service.createContent( "0", "Hello World", "Testing", `<t:${ now }:f>` );
    //     Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );
    //
    //     const result = (( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown>)[0];
    //     Assert.deepStrictEqual( result, expectedObj );
    // } );
} ).catch( console.error );

test("Testing updating an event", async t => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository );
    const eventObjRepo = mockRepository( EventObjectRepository );
    const reminderRepo = mockRepository( EventReminderRepository );

    const now = DateTime.now().plus( { days: 1 } ).toUnixInteger();

    const expectedObj = new EventObject( {
        guildId: "0",
        messageId: "1",
        name: "Hello World",
        description: "Testing",
        dateTime: now
    } );

    t.beforeEach( () => {
        settingsRepo._clear();
        eventObjRepo._clear();
        reminderRepo._clear();
    } );

    await t.test("Update by message Id", async () => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        eventObjRepo._addItems([
            ["0", new EventObject({guildId: "0", messageId: "0"})],
            ["1", new EventObject({guildId: "0", messageId: "1"})],
            ["2", new EventObject({guildId: "0", messageId: "2"})],
        ]);

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
        await service.update("0", "1", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>`);
        Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );

        const result = (( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown>)[0];
        Assert.deepStrictEqual( result, expectedObj );

        await Assert.rejects(() => service.update("0", "44", `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>`));
    });
    
    await t.test("Update by message index", async () => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        eventObjRepo._addItems([
            ["0", new EventObject({guildId: "0", messageId: "0"})],
            ["1", new EventObject({guildId: "0", messageId: "1"})],
            ["2", new EventObject({guildId: "0", messageId: "2"})],
        ]);

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
        await service.updateByIndex("0", 1, `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>`);
        Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );

        const result = (( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown>)[0];
        Assert.deepStrictEqual( result, expectedObj );
    });
}).catch(console.error);

test("Testing canceling an event", async t => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository );
    const eventObjRepo = mockRepository( EventObjectRepository );
    const reminderRepo = mockRepository( EventReminderRepository );
    
    t.beforeEach( () => {
        settingsRepo._clear();
        eventObjRepo._clear();
        reminderRepo._clear();
    } );
    
    await t.test("Cancel by message Id", async() => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );
        
        eventObjRepo._addItems([
            ["0", new EventObject({guildId: "0", messageId: "0"})],
            ["1", new EventObject({guildId: "0", messageId: "1"})],
            ["2", new EventObject({guildId: "0", messageId: "2"})],
        ]);

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
        await service.cancel("0", "1");
        
        Assert.strictEqual((eventObjRepo.delete as unknown as MockFunction).mock.callCount(), 1);
    });
    
    await t.test("Cancel by message index", async() => {
        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        eventObjRepo._addItems([
            ["0", new EventObject({guildId: "0", messageId: "0"})],
            ["1", new EventObject({guildId: "0", messageId: "1"})],
            ["2", new EventObject({guildId: "0", messageId: "2"})],
        ]);

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );
        await service.cancelByIndex("0", 1);

        Assert.strictEqual((eventObjRepo.delete as unknown as MockFunction).mock.callCount(), 1);
    });
}).catch(console.error);

test( "Testing the event reminder loop", async t => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository );
    const eventObjRepo = mockRepository( EventObjectRepository );
    const reminderRepo = mockRepository( EventReminderRepository );

    t.beforeEach( () => {
        settingsRepo._clear();
        eventObjRepo._clear();
        reminderRepo._clear();
    } );

    await t.test( "Event ticked", async t => {
        const postingChannel = {
            type: ChannelType.GuildText,
            guildId: "0",
            send: t.mock.fn( () => Promise.resolve() )
        };

        const client = {
            isReady: () => true,
            channels: {
                fetch: () => Promise.resolve( postingChannel )
            }
        } as unknown as Client;

        settingsRepo._addItem( "0", new EventManagerSettings( {
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        } ) );
        eventObjRepo._addItem( "0", new EventObject( {
            guildId: "0",
            dateTime: DateTime.now().plus( { minute: 1 } ).toUnixInteger()
        } ) );
        reminderRepo._addItem( "0", new EventReminder( {
            guildId: "0",
            message: "Hello World",
            timeDelta: "00:01"
        } ) );

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );

        await service.reminderLoop( client );
        Assert.strictEqual( postingChannel.send.mock.callCount(), 1 );
    } );
} ).catch( console.error );