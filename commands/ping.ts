import { Message, MessageEmbed } from 'discord.js';
import { BotClient } from '../indexDev';

export const name = 'ping';
export function execute(bot: BotClient, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
	const embed = new MessageEmbed()
		.addFields([
			{ name: 'Ping', value: `${Date.now() - message.createdTimestamp}ms.` },
			{ name: lang.ping.apiPing, value: `${bot.ws.ping}ms.` }
		])
		.setColor('DARK_PURPLE');

	message.reply({ content: 'Pong! 🏓', embeds: [embed] }).catch(err => { console.error(err); });
}