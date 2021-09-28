import { Message } from 'discord.js';
import { createQuizPage, alreadyPlaying } from '../src/functions/quizHandler';

export const name = 'quiz';
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, any>, language: string, prefix: string) {

	if (alreadyPlaying.has(message.channelId)) {
		message.reply(lang.quiz.alreadyPlaying);
	}
	else {
		const pageToSend: any = createQuizPage(message, message.author, lang, prefix, 'quizmainEmbed');

		message.reply({ embeds: [pageToSend[0]], components: [pageToSend[1]] });
	}
}
