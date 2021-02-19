import { Message } from 'discord.js';
import { botClient, Cmd } from 'index';

export const name = 'cry';
export function	execute(bot: botClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user || user === message.author) {
		message.channel.send(`${message.author}${lang.cry.isCrying}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else if (user === bot.user) {
		message.channel.send(`${message.author}${lang.cry.isCryingBecauseOfUs} 😦`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else {
		message.channel.send(`${user}${lang.cry.made}${message.author}${lang.cry.cry}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
};