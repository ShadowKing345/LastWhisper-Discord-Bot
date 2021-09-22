import { Listener } from "..";
import Client from "../../Client";
import { onReady } from "../../modules/roleManager";

export default new Listener((client: Client) => client.on("ready", async () => await onReady(client)));
