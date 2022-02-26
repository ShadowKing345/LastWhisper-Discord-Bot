var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function fetchMessages(client, guildId, channelId, messageIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = [];
        if (!client.guilds.cache.has(guildId))
            return;
        const guild = yield client.guilds.fetch(guildId);
        if (!guild)
            return result;
        if (!client.channels.cache.has(channelId))
            return;
        const channel = yield guild.channels.fetch(channelId);
        if (!channel)
            return result;
        for (const id of messageIds) {
            const message = yield channel.messages.fetch(id);
            if (message)
                result.push(message);
        }
        return result;
    });
}
//# sourceMappingURL=utils.js.map