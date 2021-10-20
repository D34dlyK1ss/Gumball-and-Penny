import { GuildMember, Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import getText from '../functions/getText';

export const name = 'userinfo';
export const aliases = ['ui'];
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: string) {
	const user = message.mentions.users.first() || message.author;
	const member = await message.guild.members.fetch(user);
	const createdDate = moment(user.createdAt).locale(language);
	const joinedDate = moment(member.joinedAt).locale(language);
	const createdAgo = createdDate.from(Date.now());
	const joinedAgo = joinedDate.from(Date.now());
	let roles = `<@&${(member as GuildMember)._roles.join('>, <@&')}>`;
	let nickname = member.nickname;

	if (!nickname) nickname = lang.userinfo.none;
	if (roles === '<@>') roles = 'None';

	const embed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
		.setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`)
		.addFields(
			{ name: `${lang.id}`, value: user.id },
			{ name: `${lang.nickname}`, value: nickname, inline: true },
			{ name: `${lang.joinDate}`, value: getText(lang.userinfo.joined, [joinedAgo, joinedDate.format('LLLL')]) },
			{ name: `${lang.roles}`, value: roles }
		)
		.setFooter(getText(lang.userinfo.created, [createdAgo, createdDate.format('LLLL')]));

	message.channel.send({ embeds: [embed] });
}