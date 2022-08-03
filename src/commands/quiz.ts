import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createQuizPage, alreadyPlaying } from '../functions/quizHandler';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('quiz')
		.setDescription(enLang.command.quiz.description),

	async execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, any>) {
		if (alreadyPlaying.has(interaction.channelId)) {
			interaction.reply(lang.command.quiz.alreadyPlaying);
		}
		else {
			await interaction.deferReply();

			const page = createQuizPage(interaction, interaction.user, lang, 'quizmainEmbed');
		
			await interaction.editReply({ embeds: [page.embed], components: [page.buttonRow] });
		}
	}
};
