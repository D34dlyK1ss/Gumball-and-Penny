import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('sleep')
		.setDescription(enLang.command.sleep.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.sleep.memberDesc)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member');
		const rnd = Math.floor(Math.random() * 6);
		
		if (!user || user === interaction.user) {
			interaction.reply({ content: getText(lang.command.sleep.fellAsleep, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else if (user === bot.user) {
			interaction.reply({ content: getText(lang.command.sleep.weMadeFallAsleep, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else {
			interaction.reply({ content: getText(lang.command.sleep.madeFallAsleep, [user.tag, interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
	}
};