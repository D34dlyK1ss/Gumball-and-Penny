import { Message } from 'discord.js';

export const name = 'random';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
		let rnd = args[0];

		if (rnd == '') {
			rnd = Math.floor(Math.random() * 100) + 1;
		}
		else if (!Number.isInteger(rnd)) {
			message.reply(lang.error.notANumber).catch(err => { console.error(err); });
		}
		else {
			rnd = Math.floor(Math.random() * parseInt(args[0])) + 1;
			message.channel.send(`${rnd}!`).catch(err => { console.error(err); });
		}
};
