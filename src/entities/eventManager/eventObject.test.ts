import {EventObject} from "./eventObject.js";
import {DateTime} from "luxon";
import {describe, it} from "node:test";
import Assert from "node:assert";

describe("Event Object Validation",  () => {
    it("Name", () => {
        const objData = {
            description: "Hello",
            dateTime: DateTime.now().plus({day: 1}).toUnixInteger()
        };
        Assert.ok(!(new EventObject({...objData, name: null})).isValid, "Null");
        Assert.ok(!(new EventObject({...objData, name: ""})).isValid, "Empty");
        Assert.ok(!(new EventObject({...objData, name: "    \t\t"})).isValid, "White Space");
        Assert.ok((new EventObject({...objData, name: "Correct"})).isValid, "Correct");
    });

    it("Description", () => {
        const objData = {
            name: "Hello",
            dateTime: DateTime.now().plus({day: 1}).toUnixInteger()
        };
        Assert.ok(!(new EventObject({...objData, description: null})).isValid, "Null");
        Assert.ok(!(new EventObject({...objData, description: ""})).isValid, "Empty");
        Assert.ok(!(new EventObject({...objData, description: "    \t\t"})).isValid, "White Space");
        Assert.ok((new EventObject({...objData, description: "Correct"})).isValid, "Correct");
    }); 
    
    it("Time", () => {
        const objData = {
            name: "Hello",
            description: "Hello",
        };
        const now = DateTime.now()
        
        Assert.ok(!(new EventObject({...objData, dateTime: now.toUnixInteger()})).isValid, "0");
        Assert.ok(!(new EventObject({...objData, dateTime: now.plus({day: -1}).toUnixInteger()})).isValid, "Before");
        Assert.ok((new EventObject({...objData, dateTime: now.plus({day: 1}).toUnixInteger()})).isValid, "Correct");
    });
})
