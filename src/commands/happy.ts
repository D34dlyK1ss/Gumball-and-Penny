import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('happy')
		.setDescription(enLang.command.happy.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.happy.memberDesc)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member');
		const rnd = Math.floor(Math.random() * 6);

		if (!user || user === interaction.user) {
			interaction.reply({ content: getText(lang.command.happy.isHappy, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else if (user === bot.user) {
			interaction.reply({ content: getText(lang.command.happy.weMadeHappy, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else {
			interaction.reply({ content: getText(lang.command.happy.madeHappy, [user.tag, interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
	}
};