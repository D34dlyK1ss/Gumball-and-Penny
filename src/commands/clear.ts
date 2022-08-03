import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription(enLang.command.clear.description)
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription(enLang.command.clear.numberDesc)
		),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		let integer = interaction.options.getInteger('number');
		
		if (!interaction.memberPermissions.has('ManageMessages')) {
			interaction.reply(lang.error.noPerm);
		}
		else if (!interaction.guild.members.me.permissions.has('ManageMessages')) {
			interaction.reply(lang.error.botNoManageMsgs);
		}
		else {
			let plural;
		
			if (integer > 100) integer = 100;
		
			(interaction.channel as TextChannel).bulkDelete(integer, true).then(deleted => {
				deleted.size === 1 ? plural = lang.command.clear.message : plural = lang.command.clear.messages;
				interaction.reply({ content: getText(lang.command.clear.weDeleted, [deleted.size, plural]), ephemeral: true });
			});
		}
	}
};