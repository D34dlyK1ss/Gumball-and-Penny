import { Message } from 'discord.js';

export const name = 'fact';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: undefined, language: string) {
	const rnd = Math.floor(Math.random() * 28);
	const facts = require('../data/facts.json');

	message.channel.send(facts[language][rnd]);
}
