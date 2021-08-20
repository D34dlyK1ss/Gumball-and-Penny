import { Message } from 'discord.js';
import * as which from '../src/data/which.json';

export const name = 'which';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
		let argsString = args.join(' ');
		argsString = argsString.toLowerCase();
		const last = message.member.id.slice(-1);

		if (argsString === '' || !(which as any)[argsString]) {
			message.reply(`${lang.which.noSelect}\`${prefix}help which\`${lang.forMoreInfo}`).catch(err => { console.error(err); });
		}
		else {
			message.channel.send({ content: `${(which as any)[argsString][last]}!`, files: [`img/which/${argsString} (${last}).jpg`] }).catch(err => { console.error(err); });
		}
}