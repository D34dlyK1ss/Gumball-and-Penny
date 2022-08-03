import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('vip')
		.setDescription(enLang.command.vip.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Link')
				.setStyle(5)
				.setURL('https://www.patreon.com/suicidekiss')
		);
		
		interaction.reply({ content: lang.command.vip.click, components: [row] });
	}
};