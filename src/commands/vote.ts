import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription(enLang.command.vote.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Discord Bot List')
				.setStyle(5)
				.setURL('https://discordbotlist.com/bots/gumball-and-penny/upvote')
		);
		
		interaction.reply({ content: lang.command.vote.click, components: [row] });
	}
};