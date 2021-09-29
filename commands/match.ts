import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../src/functions/getText';

export const name = 'match';
export function execute(bot: BotClient, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
	const otherUser = message.mentions.users.first();

	if (!otherUser) {
		message.reply(lang.error.noMention);
	}
	else {
		const userLast = parseInt(message.member.id.slice(-1));
		const otherUserLast = parseInt(otherUser.id.slice(-1));
		let integer = `${(Math.abs(userLast - otherUserLast) + 1) * 10}`;

		if (parseInt(integer) > 100) integer = integer.substr(1);

		if (otherUser === message.author) {
			message.reply(lang.error.noSelf);
		}
		else if (otherUser === bot.user) {
			message.channel.send(lang.match.alreadyAPair);
		}
		else if (otherUser.bot) {
			message.reply(lang.error.wontWorkOnBot);
		}
		else {
			message.reply(getText(lang.match.youAre, [integer, otherUser.tag]));
		}
	}
}