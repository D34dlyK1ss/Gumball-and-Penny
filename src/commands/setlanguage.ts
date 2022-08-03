import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('setlanguage')
		.setDescription(enLang.command.setlanguage.description),

	async execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		await interaction.deferReply();

		if (!interaction.memberPermissions.has('ManageGuild')) {
			await interaction.editReply(lang.error.noPerm);
		}
		else {
			const menuRow = new ActionRowBuilder<SelectMenuBuilder>()
				.setComponents(
					new SelectMenuBuilder()
						.setCustomId(`languageMenu${interaction.user.id}`)
						.setPlaceholder(lang.error.nothingSelected)
						.setOptions([
							{
								label: 'English',
								value: 'en'
							},
							{
								label: 'Português',
								value: 'pt'
							}
						])
				);
			const buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.setComponents(
					new ButtonBuilder()
						.setCustomId(`languageOK${interaction.user.id}`)
						.setLabel(lang.ok)
						.setStyle(3),
						
					new ButtonBuilder()
						.setCustomId(`languageCancel${interaction.user.id}`)
						.setLabel(lang.cancel)
						.setStyle(4)
				);
		
			await interaction.editReply({ content: lang.command.setlanguage.select, components: [menuRow, buttonRow] });
		}
	}
};