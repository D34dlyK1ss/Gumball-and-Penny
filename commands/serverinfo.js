const Discord = require('discord.js');
const config = require('../config.json');
const moment = require('moment');

module.exports = {
	name: 'serverinfo',
	aliases: ['si'],

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		let server = message.guild;

		if (args != '' && message.author == config.botOwner && message.channel.id === '809182965607039007') {
			server = bot.guilds.cache.get(args[0]);
		}

		const createdDate = moment(server.createdAt).locale(`${language}`),
			embed = new Discord.MessageEmbed()
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
			return message.channel.send(newEmbed).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(embed).catch(err => { console.error(err); });
		}
	},
};