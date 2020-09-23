const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'serverinfo',
	aliases: ['sinfo'],
	category: 'Server',
	description: 'All server info!',
	usage: 'serverinfo',

	execute(bot, message) {
		const server = message.guild,
			createdDate = moment(server.createdAt);

		switch (server.verificationLevel) {
		case 'NONE':
			server.verificationLevel = 'None';
			break;
		case 'LOW':
			server.verificationLevel = 'Low';
			break;
		case 'MEDIUM':
			server.verificationLevel = 'Medium';
			break;
		case 'HIGH':
			server.verificationLevel = 'High';
			break;
		case 'VERY_HIGH':
			server.verificationLevel = 'Very High';
			break;
		}

		switch (server.region) {
		case 'brazil':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'europe':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'eu-central':
			server.region = 'EU Central';
			break;
		case 'eu-east':
			server.region = 'EU East';
			break;
		case 'eu-west':
			server.region = 'EU West';
			break;
		case 'hongkong':
			server.region = 'Hong Kong';
			break;
		case 'india':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'japan':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'russia':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'singapore':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'southafrica':
			server.region = 'South Africa';
			break;
		case 'sydney':
			server.region = server.region.charAt(0).toUpperCase() + server.region.slice(1);
			break;
		case 'us-central':
			server.region = 'US Central';
			break;
		case 'us-east':
			server.region = 'US East';
			break;
		case 'us-south':
			server.region = 'US South';
			break;
		case 'us-west':
			server.region = 'US West';
			break;
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setAuthor(`${server.name}`, `${server.iconURL()}`)
			.setThumbnail(`${server.iconURL()}`)
			.addFields(
				{ name: 'ID', value: `${server.id}` },
				{ name: 'Verification Level', value: `${server.verificationLevel}`, inline: true },
				{ name: 'Region', value: `${server.region}`, inline: true },
				{ name: 'Members', value: `${server.memberCount}`, inline: true },
				{ name: 'Creation Date', value: `Created in ${createdDate.format('LLL')}` },
				{ name: 'Owner', value: `<@${server.ownerID}>`, inline: true },
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