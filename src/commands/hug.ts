import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../functions/getText';

export const name = 'hug';
export function execute(bot: BotClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: string) {
	const user = message.mentions.users.first();
	const rnd = Math.floor(Math.random() * 6);

	if (!user) {
		message.reply(getText(lang.error.wrongSyntax, [prefix, lang.command[command.name].usage]));
	}
	else if (user === message.author) {
		message.channel.send({ content: getText(lang.hug.huggedSelf, [message.author.tag]), files: [`src/img/actions/${command.name} (${rnd}).gif`] });
	}
	else if (user === bot.user) {
		message.channel.send({ content: getText(lang.hug.huggedUs, [message.author.tag]), files: [`src/img/actions/${command.name} (${rnd}).gif`] });
	}
	else {
		message.channel.send({ content: getText(lang.hug.hugged, [message.author.tag, user.tag]), files: [`src/img/actions/${command.name} (${rnd}).gif`] });
	}
}