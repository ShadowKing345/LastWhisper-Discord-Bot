import Client from "../../Client";
import { postEventRemindersLoop } from "../../modules/evenManager";
import { Task } from "../Task";

async function loop(client: Client) {
  if (!client.isReady()) return;
  await postEventRemindersLoop(client);
}

export default new Task("eventManager_postMessageLoop", 60000, loop);
