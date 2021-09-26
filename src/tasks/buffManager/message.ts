import Client from "../../Client";
import { postDailyMessage } from "../../modules/buffManager";
import { Task, waitTillReady } from "..";

async function loop(client: Client) {
  await waitTillReady(client);
  await postDailyMessage(client);
}

export default new Task("buffManager_dailyMessage_Loop", 60000, loop, true);
