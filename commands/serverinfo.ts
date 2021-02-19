import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';

export const name = 'serverinfo';
export const aliases = ['si'];
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: string) {
		const server = message.guild;
		const createdDate = moment(server.createdAt).locale(`${language}`);
		const embed = new MessageEmbed()
			.setColor('#9900ff')
			.setAuthor(`${server.name}`, `${server.iconURL()}`)
			.setThumbnail(`${server.iconURL()}`)
			.addFields(
				{ name: `${lang.id}`, value: `${server.id}` },
				{ name: `${lang.verificationLevel}`, value: `${lang.serverinfo.verificationLevel[server.verificationLevel]}`, inline: true },
				{ name: `${lang.region}`, value: `${lang.serverinfo.region[server.region]}`, inline: true },
				{ name: `${lang.membersServerInfo}`, value: `${server.memberCount}`, inline: true },
				{ name: `${lang.creation}`, value: `${lang.created + createdDate.format('LLL')}` },
				{ name: `${lang.owner}`, value: `${server.owner}`, inline: true },
			);

		if (!server.iconURL()) {
			const lastEmbed = embed;
			const newEmbed = new MessageEmbed(lastEmbed)
				.setAuthor(`${server.name}`)
				.setThumbnail('');
			message.channel.send(newEmbed).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(embed).catch(err => { console.error(err); });
		}
};