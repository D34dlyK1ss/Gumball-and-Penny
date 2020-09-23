const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	category: 'Utilidade',
	description: 'Uhm... pong?',
	usage: 'ping',

	execute(bot, message) {
		message.channel.send('Pong!').then(msg =>{
			const ping = msg.createdTimestamp - message.createdTimestamp;

			const embed = new MessageEmbed()
				.setAuthor(`O teu ping é de ${ping}ms`)
				.setColor('#8000ff');

			msg.edit(embed);
		});
	},
};