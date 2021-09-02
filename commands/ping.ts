import { Message, MessageEmbed } from 'discord.js';

export const name = 'ping';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
	message.reply('Pong!').then(msg => {
		const ping = msg.createdTimestamp - message.createdTimestamp;
		const embed = new MessageEmbed()
			.setAuthor(`${lang.ping.yourPingIs}${ping}ms`)
			.setColor('DARK_PURPLE');

		msg.edit({ embeds: [embed] });
	}).catch(err => { console.error(err); });
}