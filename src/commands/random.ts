import { Message } from 'discord.js';

export const name = 'random';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	let rnd;

	if (!args[0]) {
		rnd = Math.floor(Math.random() * 100) + 1;
		message.channel.send(`${rnd}!`);
	}
	else if (!Number.isInteger(parseInt(args[0]))) {
		message.reply(lang.error.notANumber);
	}
	else if (parseInt(args[0]) <= 0) {
		rnd = Math.floor(Math.random() * 100) + 1;
		message.channel.send(`${rnd}!`);
	}
	else {
		rnd = Math.floor(Math.random() * parseInt(args[0])) + 1;
		message.channel.send(`${rnd}!`);
	}
}
