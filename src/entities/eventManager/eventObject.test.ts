import tap from "tap";
import {EventObject} from "./eventObject.js";
import {DateTime} from "luxon";

tap.test("Event Object Validation", async t => {
    await t.test("Name", t => {
        const objData = {
            description: "Hello",
            dateTime: DateTime.now().plus({day: 1}).toUnixInteger()
        };
        t.notOk((new EventObject({...objData, name: null})).isValid, "Null");
        t.notOk((new EventObject({...objData, name: ""})).isValid, "Empty");
        t.notOk((new EventObject({...objData, name: "    \t\t"})).isValid, "White Space");
        t.ok((new EventObject({...objData, name: "Correct"})).isValid, "Correct");
        
        t.end();
    });

    await t.test("Description", t => {
        const objData = {
            name: "Hello",
            dateTime: DateTime.now().plus({day: 1}).toUnixInteger()
        };
        t.notOk((new EventObject({...objData, description: null})).isValid, "Null");
        t.notOk((new EventObject({...objData, description: ""})).isValid, "Empty");
        t.notOk((new EventObject({...objData, description: "    \t\t"})).isValid, "White Space");
        t.ok((new EventObject({...objData, description: "Correct"})).isValid, "Correct");

        t.end();
    }); 
    
    await t.test("Time", t => {
        const objData = {
            name: "Hello",
            description: "Hello",
        };
        const now = DateTime.now()
        
        t.notOk((new EventObject({...objData, dateTime: now.toUnixInteger()})).isValid, "0");
        t.notOk((new EventObject({...objData, dateTime: now.plus({day: -1}).toUnixInteger()})).isValid, "Before");
        t.ok((new EventObject({...objData, dateTime: now.plus({day: 1}).toUnixInteger()})).isValid, "Correct");

        t.end();
    });

    t.end();
}).catch(console.error)