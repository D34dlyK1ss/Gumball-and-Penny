import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';

export const name = 'match';
export function execute(bot: BotClient, message: Message, command: Cmd, db: any, lang: Record<string, string | any>) {
	const other = message.mentions.users.first();

	if (!other) {
		message.reply(lang.error.noMention).catch(err => { console.error(err); });
	}
	else {
		const last = parseInt(message.member.id.slice(-1));
		const otherLast = parseInt(other.id.slice(-1));
		let integer = `${(Math.abs(last - otherLast) + 1) * 10}`;

		if (parseInt(integer) > 100) integer = integer.substr(1);

		if (other === message.author) {
			message.reply(lang.error.noSelf).catch(err => { console.error(err); });
		}
		else if (other === bot.user) {
			message.channel.send(lang.match.alreadyAPair).catch(err => { console.error(err); });
		}
		else if (other.bot) {
			message.reply(lang.error.wontWorkOnBot).catch(err => { console.error(err); });
		}
		else {
			message.reply(`${lang.match.youAre}**${integer}%**${lang.match.compatibleWith}${other}!`).catch(err => { console.error(err); });
		}
	}
}
