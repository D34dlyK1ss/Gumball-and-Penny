import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('cry')
		.setDescription(enLang.command.cry.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.cry.memberDesc)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member');
		const rnd = Math.floor(Math.random() * 7);

		if (!user || user === interaction.user) {
			interaction.reply({ content: getText(lang.command.cry.isCrying, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else if (user === bot.user) {
			interaction.reply({ content: getText(lang.command.cry.isCryingBecauseOfUs, [interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
		else {
			interaction.reply({ content: getText(lang.command.cry.madeCry, [user.tag, interaction.user.tag]), files: [`src/img/actions/${interaction.commandName} (${rnd}).gif`] });
		}
	}
};