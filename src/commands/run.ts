import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('run')
		.setDescription(enLang.command.run.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.run.memberDesc)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member');
		const rnd = Math.floor(Math.random() * 6);
		
		if (!user || user === interaction.user) {
			interaction.reply({ content: getText(lang.command.run.ranAway, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else if (user === bot.user) {
			interaction.reply({ content: getText(lang.command.run.ranAwayFromUs, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else {
			interaction.reply({ content: getText(lang.command.run.ranAwayFrom, [interaction.user.tag, user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
	}
};