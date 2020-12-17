const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',

	execute(bot, message, command, db, lang) {
		message.channel.send('Pong!').then(msg =>{
			const ping = msg.createdTimestamp - message.createdTimestamp;

			const embed = new MessageEmbed()
				.setAuthor(`${lang.ping.yourPingIs}${ping}ms`)
				.setColor('#8000ff');

			msg.edit(embed);
		}).catch(err => { console.error(err); });
	},
};