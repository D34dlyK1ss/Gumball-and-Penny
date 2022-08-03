import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('members')
		.setDescription(enLang.command.members.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		interaction.reply(getText(lang.command.members.message, [interaction.guild.name, interaction.guild.memberCount]));
	}
};