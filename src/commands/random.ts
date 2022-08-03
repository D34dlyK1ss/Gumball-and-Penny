import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription(enLang.command.random.description)
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription(enLang.command.random.numberDesc)
				.setMinValue(1)
				.setRequired(true)
		),

	execute(bot: undefined, interaction: ChatInputCommandInteraction) {
		const rnd = Math.floor(Math.random() * interaction.options.getInteger('number')) + 1;

		interaction.reply(`${rnd}!`);
	}
};