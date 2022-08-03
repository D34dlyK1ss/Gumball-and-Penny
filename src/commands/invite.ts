import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription(enLang.command.invite.description),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		interaction.reply(`${lang.inviteUsToYourServer}\nhttps://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=139858406464&scope=bot%20applications.commands`);
	}
};