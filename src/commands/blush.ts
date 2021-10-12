import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../functions/getText';

export const name = 'blush';
export function execute(bot: BotClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user) {
		return;
	}
	else if (user === bot.user) {
		message.channel.send({ content: getText(lang.blush.weMadeBlush, [message.author.tag]), files: [`src/img/actions/${command.name} (${rnd}).gif`] });
	}
	else {
		message.channel.send({ content: getText(lang.blush.madeBlush, [user.tag, message.author.tag]), files: [`src/img/actions/${command.name} (${rnd}).gif`] });
	}
}