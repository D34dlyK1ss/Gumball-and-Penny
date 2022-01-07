import { Message } from 'discord.js';
import { BotClient } from 'index';

export const name = 'invite';
export function execute(bot: BotClient, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
	message.channel.send(`${lang.inviteUsToYourServer}\nhttps://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=1239370034246&scope=bot`);
}