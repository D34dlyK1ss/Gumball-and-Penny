import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';

export const name = 'userinfo';
export const aliases = ['ui'];
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: string) {
	const user = message.mentions.users.first() || message.author;
	const member = await message.guild.members.fetch(user);
	const createdDate = moment(user.createdAt).locale(language);
	const joinedDate = moment(member.joinedAt).locale(language);
	const created = createdDate.from(Date.now());
	const joined = joinedDate.from(Date.now());
	let roles = `<@&${(member as any)._roles.join('>, <@&')}>`;

	if (roles === '<@>') roles = 'None';

	const embed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setThumbnail(`${user.displayAvatarURL()}`)
		.addFields(
			{ name: `${lang.id}`, value: `${user.id}` },
			{ name: `${lang.mention}`, value: `${user}`, inline: true },
			{ name: `${lang.joined}`, value: `${lang.userinfo.joined}${joined}${lang.ago}(${joinedDate.format('LLLL')})` },
			{ name: `${lang.roles}`, value: `${roles}`, inline: true }
		)
		.setFooter(`${lang.created}${created}${lang.ago}(${createdDate.format('LLLL')})`);

	message.channel.send({ embeds: [embed] }).catch(err => { console.error(err); });
}