import Client from "../../Client";
import { postEventRemindersLoop } from "../../modules/evenManager";
import { Task, waitTillReady } from "..";

async function loop(client: Client) {
  await waitTillReady(client);
  await postEventRemindersLoop(client);
}

export default new Task("eventManager_postMessageLoop", 60000, loop, true);
