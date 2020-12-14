const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'serverinfo',
	aliases: ['si'],

	execute(bot, message, command, db, lang, language) {
		const server = message.guild,
			createdDate = moment(server.createdAt).locale(`${language}`);
		const embed = new Discord.MessageEmbed()
			.setColor('#8000ff')
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
			const newEmbed = new Discord.MessageEmbed(lastEmbed)
				.setAuthor(`${server.name}`)
				.setThumbnail();
			return message.channel.send(newEmbed).catch();
		}
		else {
			message.channel.send(embed).catch();
		}
	},
};