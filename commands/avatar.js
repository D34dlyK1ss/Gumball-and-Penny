const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'avatar',
	category: 'Utilidade',
	description: 'Vê o avatar de um membro do servidor!',
	usage: '`+avatar [opcional - @utilizador]`',

	execute(bot, message) {
		const user = message.mentions.users.first() || message.author;
		message.channel.send(new MessageAttachment(user.displayAvatarURL()));
	},
};