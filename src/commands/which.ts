import { Message } from 'discord.js';
import * as which from '../data/which.json';
import getText from '../functions/getText';

export const name = 'which';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	let argsString = args.join(' ');
	argsString = argsString.toLowerCase();
	const last = (message.member?.id as string).slice(-1);

	if (argsString === '' || !(which as any)[argsString]) {
		message.reply(getText(lang.which.noSelect, [prefix, lang.forMoreInfo]));
	}
	else {
		message.channel.send({ content: `${(which as any)[argsString][last]}!`, files: [`src/img/which/${argsString} (${last}).jpg`] });
	}
}