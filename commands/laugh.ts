import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';

export const name = 'laugh';
export function execute(bot: BotClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user) {
		message.channel.send({ content: `${message.author}${lang.laugh.isLaughing}`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else if (user === message.author) {
		message.channel.send({ content: `${message.author}${lang.laugh.isLaughingFromSelf}`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else if (user === bot.user) {
		message.channel.send({ content: `${message.author}${lang.laugh.isLaughingFromUs} 😅`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
	else {
		message.channel.send({ content: `${message.author}${lang.laugh.isLaughingFrom}${user}!`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	}
}