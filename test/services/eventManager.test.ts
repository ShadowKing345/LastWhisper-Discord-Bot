import { EventManagerSettingsRepository } from "../../src/repositories/eventManager/eventManagerSettingsRepository.js";
import { EventManagerService } from "../../src/services/eventManager.js";
import { EventObjectRepository } from "../../src/repositories/eventManager/eventObjectRepository.js";
import { EventReminderRepository } from "../../src/repositories/eventManager/eventReminderRepository.js";
import { DateTime } from "luxon";
import { mock, before, after, describe, beforeEach, it, afterEach } from "node:test";
import Assert from "node:assert";
import { mockRepository } from "../utils/mockRepository.js";
import { EventManagerSettings } from "../../src/entities/eventManager/index.js";
import { ChannelType, Client } from "discord.js";
import { EventObject, EventReminder } from "../../src/entities/eventManager/index.js";

const _ = mock.fn<() => Promise<unknown>>( () => Promise.resolve() );
type MockFunction = typeof _

function testEventObjectEquality( actual: EventObject, expected: EventObject ) {
    Assert.deepStrictEqual( actual.additional, expected.additional );
    Assert.deepStrictEqual( actual.dateTime, expected.dateTime );
    Assert.deepStrictEqual( actual.description, expected.description );
    Assert.deepStrictEqual( actual.guildId, expected.guildId );
    Assert.deepStrictEqual( actual.messageId, expected.messageId );
    Assert.deepStrictEqual( actual.name, expected.name );
}

afterEach( () => {
    mock.restoreAll();
} );

describe( "Testing the parser.", () => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository, EventManagerSettings );

    before( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearUp(),
        ] );
    } );

    after( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearDown(),
        ] );
    } );

    beforeEach( async () => {
        await Promise.allSettled( [
            settingsRepo.$clear(),
        ] );
    } );

    it( "Message got parsed correctly.", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        } ) );
        const service = new EventManagerService( settingsRepo, null, null );

        const result = await service.parseEventGuildId( "0", { text: `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ DateTime.now().plus( { days: 1 } ).toUnixInteger() }:f>` } );
        Assert.ok( result );
        Assert.ok( result?.isValid );
    } );

    it( "Message is wrong", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        } ) );
        const service = new EventManagerService( settingsRepo, null, null );
        const now = DateTime.now().plus( { days: 1 } ).toUnixInteger();

        Assert.ok( !( await service.parseEventGuildId( "0", { text: `[description]\nTesting\n[time]\n<t:${ now }:f>` } ) ).isValid, "Bad event name" )
        Assert.ok( !( await service.parseEventGuildId( "0", { text: `[announcement]\nHello World\n[time]\n<t:${ now }:f>` } ) ).isValid, "Bad event description" )
        Assert.ok( !( await service.parseEventGuildId( "0", { text: `[announcement]\nHello World\n[description]\nTesting` } ) ).isValid, "Bad time" )
        Assert.ok( !( await service.parseEventGuildId( "0", { text: `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ 0 }:f>` } ) ).isValid, "Time is before now" );
    } );
} );

describe( "Event was successfully created.", () => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository, EventManagerSettings );
    const eventObjRepo = mockRepository( EventObjectRepository, EventObject );

    before( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearUp(),
            eventObjRepo.$tearUp(),
        ] );
    } );

    after( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearDown(),
            eventObjRepo.$tearDown(),
        ] );
    } );

    beforeEach( async () => {
        await Promise.allSettled( [
            settingsRepo.$clear(),
            eventObjRepo.$clear(),
        ] );
    } );

    const now = DateTime.now().plus( { days: 1 } ).toUnixInteger();
    const expectedObj = new EventObject( {
        guildId: "0",
        name: "Hello World",
        description: "Testing",
        dateTime: now
    } );

    it( "Saved a new event with text.", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        mock.method( eventObjRepo, "save" );

        const service = new EventManagerService( settingsRepo, eventObjRepo, null );

        await service.create( "0", "1", { text: `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>` } );
        Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );
        const result = ( ( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown> )[0] as EventObject;

        testEventObjectEquality( result, expectedObj );
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
} );

describe( "Testing updating an event", () => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository, EventManagerSettings );
    const eventObjRepo = mockRepository( EventObjectRepository, EventObject );

    before( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearUp(),
            eventObjRepo.$tearUp(),
        ] );
    } );

    after( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearDown(),
            eventObjRepo.$tearDown(),
        ] );
    } );

    beforeEach( async () => {
        await Promise.allSettled( [
            settingsRepo.$clear(),
            eventObjRepo.$clear(),
        ] );
    } );

    const now = DateTime.now().plus( { days: 1 } ).toUnixInteger();

    const expectedObj = new EventObject( {
        guildId: "0",
        messageId: "1",
        name: "Hello World",
        description: "Testing",
        dateTime: now
    } );

    it( "Update by message Id", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        await eventObjRepo.bulkSave( [
            new EventObject( { guildId: "0", messageId: "0", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "1", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "2", name: "test", description: "testing", dateTime: 300 } ),
        ] );

        mock.method( eventObjRepo, "save" );

        const service = new EventManagerService( settingsRepo, eventObjRepo, null );
        await service.update( "0", "1", { text: `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>` } );
        Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );

        const result = ( ( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown> )[0] as EventObject;
        testEventObjectEquality( result, expectedObj );

        await Assert.rejects( () => service.update( "0", "44", { text: `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>` } ) );
    } );

    it( "Update by message index", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        await eventObjRepo.bulkSave( [
            new EventObject( { guildId: "0", messageId: "0", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "1", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "2", name: "test", description: "testing", dateTime: 300 } ),
        ] );

        mock.method( eventObjRepo, "save" );

        const service = new EventManagerService( settingsRepo, eventObjRepo, null );
        await service.updateByIndex( "0", 1, { text: `[announcement]\nHello World\n[description]\nTesting\n[time]\n<t:${ now }:f>` } );
        Assert.strictEqual( ( eventObjRepo.save as unknown as MockFunction ).mock.callCount(), 1 );

        const result = ( ( eventObjRepo.save as unknown as MockFunction ).mock.calls[0].arguments as Array<unknown> )[0] as EventObject;
        testEventObjectEquality( result, expectedObj );
    } );
} );

describe( "Testing canceling an event", () => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository, EventManagerSettings );
    const eventObjRepo = mockRepository( EventObjectRepository, EventObject );

    before( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearUp(),
            eventObjRepo.$tearUp(),
        ] );
    } );

    after( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearDown(),
            eventObjRepo.$tearDown(),
        ] );
    } );

    beforeEach( async () => {
        await Promise.allSettled( [
            settingsRepo.$clear(),
            eventObjRepo.$clear(),
        ] );
    } );

    it( "Cancel by message Id", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        await eventObjRepo.bulkSave( [
            new EventObject( { guildId: "0", messageId: "0", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "1", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "2", name: "test", description: "testing", dateTime: 300 } ),
        ] );

        mock.method( eventObjRepo, "delete" );

        const service = new EventManagerService( settingsRepo, eventObjRepo, null );
        await service.cancel( "0", "1" );

        Assert.strictEqual( ( eventObjRepo.delete as unknown as MockFunction ).mock.callCount(), 1 );
    } );

    it( "Cancel by message index", async () => {
        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            listenerChannelId: "1",
            announcement: "announcement",
            description: "description",
            dateTime: "time",
        } ) );

        await eventObjRepo.bulkSave( [
            new EventObject( { guildId: "0", messageId: "0", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "1", name: "test", description: "testing", dateTime: 300 } ),
            new EventObject( { guildId: "0", messageId: "2", name: "test", description: "testing", dateTime: 300 } ),
        ] );

        mock.method( eventObjRepo, "delete" );

        const service = new EventManagerService( settingsRepo, eventObjRepo, null );
        await service.cancelByIndex( "0", 1 );

        Assert.strictEqual( ( eventObjRepo.delete as unknown as MockFunction ).mock.callCount(), 1 );
    } );
} );

describe( "Testing the event reminder loop", () => {
    const settingsRepo = mockRepository( EventManagerSettingsRepository, EventManagerSettings );
    const eventObjRepo = mockRepository( EventObjectRepository, EventObject );
    const reminderRepo = mockRepository( EventReminderRepository, EventReminder );

    before( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearUp(),
            eventObjRepo.$tearUp(),
            reminderRepo.$tearUp(),
        ] );
    } );

    after( async () => {
        await Promise.allSettled( [
            settingsRepo.$tearDown(),
            eventObjRepo.$tearDown(),
            reminderRepo.$tearDown(),
        ] );
    } );

    beforeEach( async () => {
        await Promise.allSettled( [
            settingsRepo.$clear(),
            eventObjRepo.$clear(),
            reminderRepo.$clear(),
        ] );
    } )

    it( "Event ticked", async () => {
        const postingChannel = {
            type: ChannelType.GuildText,
            guildId: "0",
            channelId: "0",
            send: mock.fn( () => Promise.resolve() )
        };

        const client = {
            isReady: () => true,
            channels: {
                fetch: () => Promise.resolve( postingChannel )
            },
            guilds: {
                fetch: () => true
            },
        } as unknown as Client;

        await settingsRepo.save( new EventManagerSettings( {
            guildId: "0",
            announcement: "announcement",
            description: "description",
            dateTime: "time"
        } ) );
        await eventObjRepo.save( new EventObject( {
            guildId: "0",
            dateTime: DateTime.now().plus( { minute: 1 } ).toUnixInteger(),
            name: "test",
            description: "testing",
        } ) );
        await reminderRepo.save( new EventReminder( {
            guildId: "0",
            message: "Hello World",
            timeDelta: 60
        } ) );

        const service = new EventManagerService( settingsRepo, eventObjRepo, reminderRepo );

        await service.reminderLoop( client );
        Assert.strictEqual( postingChannel.send.mock.callCount(), 1 );
    } );
} );