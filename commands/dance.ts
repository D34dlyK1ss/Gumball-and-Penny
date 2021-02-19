import { Client, Message } from 'discord.js';
import { Cmd } from 'index';

export const name = 'dance';
export function execute(bot: Client, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user || user === message.author) {
			message.channel.send(`${message.author}${lang.dance.isDancing}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
		else if (user === bot.user) {
			message.channel.send(`${message.author}${lang.dance.isDancingForUs}😯`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(`${message.author}${lang.dance.isDancingFor}${user}!`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
};