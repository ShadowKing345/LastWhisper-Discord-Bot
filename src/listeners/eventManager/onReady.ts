import Client from "../../Client";
import { DefaultConfig } from "../../objects/eventManager";
import { Listener } from "..";
import { fetchMessages } from "../../modules/utils";

async function listener(client: Client) {
  const configs: { [guildId: string]: DefaultConfig } = await client.configs.getConfigs<DefaultConfig>("eventManager");

  for (const [guildId, config] of Object.entries(configs)) {
    if (!config.listenerChannelId || !config.events.length) continue;
    fetchMessages(client, guildId, config.listenerChannelId, config.events.map(event => event.messageId)).catch(error => console.error(error));
  }
}

export default new Listener((client: Client) => client.on("ready", async () => await listener(client)));
