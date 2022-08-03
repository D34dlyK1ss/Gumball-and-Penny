import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription(enLang.command.avatar.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.avatar.memberDesc)
		),
			
	execute(bot: undefined, interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user') || interaction.user;
		
		interaction.reply({ files: [user.displayAvatarURL()] });
	}
};