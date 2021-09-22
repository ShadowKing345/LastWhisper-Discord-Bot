import { TextChannel } from "discord.js";
import Client from "../../Client";
import { DefaultConfig } from "../../objects/eventManager";
import { Listener } from "..";

async function listen(client: Client) {
  const configs: { [guildId: string]: DefaultConfig } = client.configs.getConfigs<DefaultConfig>("eventManager");

  for (const [_, config] of Object.entries(configs)) {
    if (!config.listenerChannelId) continue;
    const channel = await client.channels.fetch(config.listenerChannelId);

    if (!channel) continue;

    for (const messageId of config.events.map(event => event.messageId)) {
      try { await (channel as TextChannel).messages.fetch(messageId) } catch (error) { console.error(error) };
    }
  }
}

export default new Listener((client: Client) => client.on("ready", async () => await listen(client)));
