const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],
	category: 'Utility',
	description: 'Check a member\'s avatar!',
	usage: 'avatar [optional - @member]',

	execute(bot, message) {
		const user = message.mentions.users.first() || message.author;
		message.channel.send(new MessageAttachment(user.displayAvatarURL()));
	},
};