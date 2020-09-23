const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	category: 'Utility',
	description: 'Uhm... pong?',
	usage: 'ping',

	execute(bot, message) {
		message.channel.send('Pong!').then(msg =>{
			const ping = msg.createdTimestamp - message.createdTimestamp;

			const embed = new MessageEmbed()
				.setAuthor(`Your ping is ${ping}ms`)
				.setColor('#8000ff');

			msg.edit(embed);
		});
	},
};