const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	aliases: ['uinfo'],
	category: 'Server',
	description: 'Check a member\'s information!',
	usage: 'userinfo [optional - @member]',

	execute(bot, message) {
		const user = message.mentions.users.first() || message.author;
		const member = message.guild.member(user),
			createdDate = moment(user.createdAt),
			joinedDate = moment(member.joinedAt);
		const created = createdDate.from(Date.now()),
			joined = joinedDate.from(Date.now());

		switch (user.presence.status) {
		case 'online':
			user.presence.status = user.presence.status.charAt(0).toUpperCase() + user.presence.status.slice(1);
			break;
		case 'idle':
			user.presence.status = user.presence.status.charAt(0).toUpperCase() + user.presence.status.slice(1);
			break;
		case 'dnd':
			user.presence.status = 'Do Not Disturb';
			break;
		case 'offline':
			user.presence.status = user.presence.status.charAt(0).toUpperCase() + user.presence.status.slice(1);
			break;
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setAuthor(`${user.tag}`, `${user.displayAvatarURL()}`)
			.setThumbnail(`${user.displayAvatarURL()}`)
			.addFields(
				{ name: 'ID', value: `${user.id}` },
				{ name: 'Status', value: `${user.presence.status}`, inline: true },
				{ name: 'Mention', value: `${user}`, inline: true },
				{ name: 'Joining Date', value: `Joined ${joined} ago (${joinedDate.format('LLLL')})` },
				{ name: 'Roles', value: `<@&${member._roles.join('>, <@&')}>`, inline: true },
			)
			.setFooter(`Created ${created} ago (${createdDate.format('LLLL')})`);

		message.channel.send(embed);
	},
};