import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import getText from '../functions/getText';

export const name = 'serverinfo';
export const aliases = ['si'];
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: string) {
	const createdDate = moment(message.guild.createdAt).locale(language);
	const createdAgo = createdDate.from(Date.now());

	const embed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
		.setThumbnail(message.guild.iconURL({ dynamic: true }))
		.addFields(
			{ name: `${lang.id}`, value: `${message.guild.id}` },
			{ name: `${lang.verificationLevel}`, value: `${lang.serverinfo.verificationLevel[message.guild.verificationLevel]}` },
			/*{ name: `${lang.region}`, value: `${lang.serverinfo.region[message.guild.region]}`, inline: true },*/
			{ name: `${lang.membersServerInfo}`, value: `${message.guild.memberCount}`, inline: true },
			{ name: `${lang.owner}`, value: `<@${message.guild.ownerId}>` },
			{ name: `${lang.creation}`, value: getText(lang.serverinfo.created, [createdAgo, createdDate.format('LLLL')]) },
		);

	message.channel.send({ embeds: [embed] });
}