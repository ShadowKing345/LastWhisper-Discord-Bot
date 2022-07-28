import "reflect-metadata";

import { injectable } from "tsyringe";

import { EventManagerService } from "../../src/event_manager/index.js";

@injectable()
class module extends EventManagerService {

}

test("The event manager service should ", () => {
    expect(true).toBeTruthy();
});