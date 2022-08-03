import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import facts from '../data/facts.json';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription(enLang.command.fact.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: undefined, language: string) {
		const rnd = Math.floor(Math.random() * 28);

		interaction.reply((facts as Record<string, string[]>)[language][rnd]);
	}
};