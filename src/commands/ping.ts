import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription(enLang.command.ping.description),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const embed = new EmbedBuilder()
			.addFields([
				{ name: 'Ping', value: `${Date.now() - interaction.createdTimestamp}ms` },
				{ name: lang.command.ping.apiPing, value: `${bot.ws.ping}ms` }
			])
			.setColor('DarkPurple');
		
		interaction.reply({ content: 'Pong! 🏓', embeds: [embed] });
	}
};