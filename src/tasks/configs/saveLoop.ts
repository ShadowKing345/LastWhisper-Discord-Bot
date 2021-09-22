import Client from "../../Client";
import { Task } from "../Task";

async function loop(client: Client) {
  if (!client.isReady()) return;
  client.configs.saveConfigs();
}

export default new Task("eventManager_postMessageLoop", 432000, loop);
