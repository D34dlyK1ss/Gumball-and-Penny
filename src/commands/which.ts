import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import which from '../data/which.json';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('which')
		.setDescription(enLang.command.which.description)
		.addStringOption(option => {
			option.setName('anime')
				.setDescription(enLang.command.which.animeDesc)
				.setRequired(true);

			const choices = Object.keys(which);

			choices.forEach(element => {
				option.addChoices({ name: element, value: element });
			});
			
			return option;
		}),

	execute(bot: undefined, interaction: ChatInputCommandInteraction) {
		const last = parseInt(interaction.user.id.slice(-1));
		const anime = interaction.options.getString('anime');

		interaction.reply({ content: `${(which as Record<string, string[]>)[anime][last]}!`, files: [`src/img/which/${anime} (${last}).jpg`] });
	}
};