import { Client, Message } from 'discord.js';
import { Cmd } from 'index';

export const name = 'kiss';
export function execute(bot: Client, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user) {
		return;
	}
	else if (user === message.author) {
		message.channel.send(`${message.author}${lang.kiss.kissedSelf}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else if (user === bot.user) {
		message.channel.send(`${message.author}${lang.kiss.kissedUs} 😳`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else {
		message.channel.send(`${message.author}${lang.kiss.kissed}${user}!`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
};