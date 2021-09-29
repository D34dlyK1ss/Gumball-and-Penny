import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../src/functions/getText';

export const name = 'run';
export function execute(bot: BotClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user || user === message.author) {
		message.channel.send({ content: getText(lang.run.ranAway, [message.author.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
	else if (user === bot.user) {
		message.channel.send({ content: getText(lang.run.ranAwayFromUs, [message.author.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
	else {
		message.channel.send({ content: getText(lang.run.ranAwayFrom, [message.author.tag, user.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
}