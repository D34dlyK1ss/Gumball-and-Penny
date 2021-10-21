import { Message } from 'discord.js';
import facts from '../data/facts.json';

export const name = 'fact';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: undefined, language: string) {
	const rnd = Math.floor(Math.random() * 28);

	message.channel.send((facts as Record<string, string[]>)[language][rnd]);
}
