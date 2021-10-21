import { Message, MessageActionRow, MessageEmbed } from 'discord.js';
import { createQuizPage, alreadyPlaying } from '../functions/quizHandler';

export const name = 'quiz';
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, any>, language: string, prefix: string) {

	if (alreadyPlaying.has(message.channelId)) {
		message.reply(lang.quiz.alreadyPlaying);
	}
	else {
		const pageToSend: (MessageEmbed|MessageActionRow)[] = createQuizPage(message, message.author, lang, prefix, 'quizmainEmbed');

		message.reply({ embeds: [pageToSend[0] as MessageEmbed], components: [pageToSend[1] as MessageActionRow] });
	}
}
