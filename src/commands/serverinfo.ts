import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription(enLang.command.serverinfo.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>, language: string) {
		const createdDate = moment(interaction.guild.createdAt).locale(language);
		const createdAgo = createdDate.from(Date.now());
		
		const embed = new EmbedBuilder()
			.setColor('DarkPurple')
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: `${lang.id}`, value: `${interaction.guild.id}` },
				{ name: `${lang.verificationLevel}`, value: lang.serverinfo.verificationLevel[interaction.guild.verificationLevel] },
				{ name: `${lang.command.serverinfo.members}`, value: `${interaction.guild.memberCount}` },
				{ name: `${lang.owner}`, value: `<@${interaction.guild.ownerId}>` },
				{ name: `${lang.creation}`, value: getText(lang.serverinfo.created, [createdAgo, createdDate.format('LLLL')]) }
			);
		
		interaction.reply({ embeds: [embed] });
	}
};