import { Message } from 'discord.js';
import { createQuizPage } from '../src/functions/quizHandler';

export const name = 'quiz';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, any>, language: string, prefix: string) {
	const pageToSend: any = createQuizPage(message.author, lang, prefix, 'quizmainEmbed');
	
	message.channel.send({ embeds: [pageToSend[0]], components: [pageToSend[1]] }).catch(err => { console.error(err); });
};
