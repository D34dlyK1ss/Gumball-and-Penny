import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('blush')
		.setDescription(enLang.command.blush.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.blush.memberDesc)
				.setRequired(true)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member');
		const rnd = Math.floor(Math.random() * 6);
		
		if (user === bot.user) {
			interaction.reply({ content: getText(lang.command.blush.weMadeBlush, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else {
			interaction.reply({ content: getText(lang.command.blush.madeBlush, [user.tag, interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
	}
};