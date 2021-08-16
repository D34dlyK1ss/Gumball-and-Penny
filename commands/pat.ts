import { Client, Message } from 'discord.js';
import { Cmd } from 'index';

export const name = 'pat';
export function execute(bot: Client, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user) {
		return;
	}
	else if (user === message.author) {
		message.channel.send({ content: `${message.author}${lang.pat.pattedSelf}`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else if (user === bot.user) {
		message.channel.send({ content: `${message.author}${lang.pat.pattedUs} 😊`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else {
		message.channel.send({ content: `${message.author}${lang.pat.patted}${user}!`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
};