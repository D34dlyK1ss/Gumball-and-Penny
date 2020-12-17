const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	aliases: ['ui'],

	execute(bot, message, command, db, lang, language) {
		const user = message.mentions.users.first() || message.author;
		const member = message.guild.member(user),
			createdDate = moment(user.createdAt).locale(`${language}`),
			joinedDate = moment(member.joinedAt).locale(`${language}`);
		const created = createdDate.from(Date.now()),
			joined = joinedDate.from(Date.now());
		let roles = `<@&${member._roles.join('>, <@&')}>`;

		switch (roles) {
		case '<@>':
			roles = 'none';
			break;
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setAuthor(`${user.tag}`, `${user.displayAvatarURL()}`)
			.setThumbnail(`${user.displayAvatarURL()}`)
			.addFields(
				{ name: `${lang.id}`, value: `${user.id}` },
				{ name: `${lang.status}`, value: `${lang.userinfo.status[user.presence.status]}`, inline: true },
				{ name: `${lang.mention}`, value: `${user}`, inline: true },
				{ name: `${lang.joined}`, value: `${lang.userinfo.joined + joined + lang.ago}(${joinedDate.format('LLLL')})` },
				{ name: `${lang.roles}`, value: `${roles}`, inline: true },
			)
			.setFooter(`${lang.created + created + lang.ago}(${createdDate.format('LLLL')})`);

		message.channel.send(embed).catch(err => { console.error(err); });
	},
};