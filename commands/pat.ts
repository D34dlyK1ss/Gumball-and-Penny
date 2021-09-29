import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../src/functions/getText';

export const name = 'pat';
export function execute(bot: BotClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user) {
		return;
	}
	else if (user === message.author) {
		message.channel.send({ content: getText(lang.pat.pattedSelf, [message.author.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
	else if (user === bot.user) {
		message.channel.send({ content: getText(lang.pat.pattedUs, [message.author.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
	else {
		message.channel.send({ content: getText(lang.pat.patted, [message.author.tag, user.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
}