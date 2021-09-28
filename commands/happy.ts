import { Message } from 'discord.js';
import { Cmd } from 'index';
import text from '../src/functions/text';

export const name = 'happy';
export function execute(bot: undefined, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (user) {
		message.channel.send({ content: text(lang.happy.madeHappy, [user.tag, message.author.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
	else {
		message.channel.send({ content: text(lang.happy.isHappy, [message.author.tag]), files: [`img/actions/${command.name} (${rnd}).gif`] });
	}
}