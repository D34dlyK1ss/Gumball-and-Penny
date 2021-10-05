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
		.setThumbnail(`${message.guild.iconURL()}`)
		.addFields(
			{ name: `${lang.id}`, value: `${message.guild.id}` },
			{ name: `${lang.verificationLevel}`, value: `${lang.serverinfo.verificationLevel[message.guild.verificationLevel]}`, inline: true },
			/*{ name: `${lang.region}`, value: `${lang.serverinfo.region[message.guild.region]}`, inline: true },*/
			{ name: `${lang.membersServerInfo}`, value: `${message.guild.memberCount}`, inline: true },
			{ name: `${lang.creation}`, value: getText(lang.serverinfo.created, [createdAgo, createdDate.format('LLLL')]) },
			{ name: `${lang.owner}`, value: `<@${message.guild.ownerId}>`, inline: true }
		);

	if (!message.guild.iconURL()) {
		const lastEmbed = embed;
		const newEmbed = new MessageEmbed(lastEmbed)
			.setAuthor(`${message.guild.name}`)
			.setThumbnail('');
		message.channel.send({ embeds: [newEmbed] });
	}
	else {
		message.channel.send({ embeds: [embed] });
	}
}