const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'serverinfo',
	aliases: ['sinfo'],
	category: 'Servidor',
	description: 'Todas as informações do servidor!',
	usage: 'serverinfo',

	execute(bot, message) {
		const server = message.guild,
			createdDate = moment(server.createdAt).locale('pt');

		switch (server.verificationLevel) {
		case 'NONE':
			server.verificationLevel = 'Nenhum';
			break;
		case 'LOW':
			server.verificationLevel = 'Baixo';
			break;
		case 'MEDIUM':
			server.verificationLevel = 'Médio';
			break;
		case 'HIGH':
			server.verificationLevel = 'Alto';
			break;
		case 'HIGHEST':
			server.verificationLevel = 'Muito Alto';
			break;
		}

		switch (server.region) {
		case 'brazil':
			server.region = 'Brasil';
			break;
		case 'europe':
			server.region = 'Europa';
			break;
		case 'eu-central':
			server.region = 'Europa Central';
			break;
		case 'eu-east':
			server.region = 'Europa Este';
			break;
		case 'eu-west':
			server.region = 'Europa Oeste';
			break;
		case 'hongkong':
			server.region = 'Hong Kong';
			break;
		case 'india':
			server.region = 'Índia';
			break;
		case 'japan':
			server.region = 'Japão';
			break;
		case 'russia':
			server.region = 'Rússia';
			break;
		case 'singapore':
			server.region = 'Singapura';
			break;
		case 'southafrica':
			server.region = 'África do Sul';
			break;
		case 'sydney':
			server.region = 'Sydney';
			break;
		case 'us-central':
			server.region = 'EUA Central';
			break;
		case 'us-east':
			server.region = 'EUA Este';
			break;
		case 'us-south':
			server.region = 'EUA Sul';
			break;
		case 'us-west':
			server.region = 'EUA Oeste';
			break;
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setAuthor(`${server.name}`, `${server.iconURL()}`)
			.setThumbnail(`${server.iconURL()}`)
			.addFields(
				{ name: 'ID', value: `${server.id}` },
				{ name: 'Nível de Verificação', value: `${server.verificationLevel}`, inline: true },
				{ name: 'Região', value: `${server.region}`, inline: true },
				{ name: 'Membros', value: `${server.memberCount}`, inline: true },
				{ name: 'Criação', value: `Criado a ${createdDate.format('LLL')}` },
				{ name: 'Proprietário', value: `<@${server.ownerID}>`, inline: true },
			);

		if (!server.iconURL()) {
			const lastEmbed = embed;
			const newEmbed = new Discord.MessageEmbed(lastEmbed)
				.setAuthor(`${server.name}`)
				.setThumbnail();
			return message.channel.send(newEmbed);
		}
		else {
			message.channel.send(embed);
		}
	},
};