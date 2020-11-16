const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	aliases: ['uinfo'],
	category: 'Servidor',
	description: 'Com este comando serás informado sobre algum membro mencionado!',
	usage: 'userinfo [opcional - @membro]',

	execute(bot, message) {
		const user = message.mentions.users.first() || message.author;
		const member = message.guild.member(user),
			createdDate = moment(user.createdAt).locale('pt'),
			joinedDate = moment(member.joinedAt).locale('pt');
		const created = createdDate.from(Date.now()),
			joined = joinedDate.from(Date.now());

		switch (user.presence.status) {
		case 'online':
			user.presence.status = 'Online';
			break;
		case 'idle':
			user.presence.status = 'Ausente';
			break;
		case 'dnd':
			user.presence.status = 'Não Perturbar';
			break;
		case 'offline':
			user.presence.status = 'Offline';
			break;
		}

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
				{ name: 'ID', value: `${user.id}` },
				{ name: 'Status', value: `${user.presence.status}`, inline: true },
				{ name: 'Menção', value: `${user}`, inline: true },
				{ name: 'Entrada', value: `Entrou ${joined} atrás (${joinedDate.format('LLLL')})` },
				{ name: 'Roles', value: `${roles}`, inline: true },
			)
			.setFooter(`Criado ${created} atrás (${createdDate.format('LLLL')})`);

		message.channel.send(embed);
	},
};