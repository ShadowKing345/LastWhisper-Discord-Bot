import Client from "../../Client";
import { postDailyMessage } from "../../modules/buffManager";
import { Task } from "..";

async function loop(client: Client) {
  if (!client.isReady()) return;
  await postDailyMessage(client);
}

export default new Task("buffManager_dailyMessage_Loop", 60000, loop);
