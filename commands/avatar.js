const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp'],

	execute(bot, message) {
		const user = message.mentions.users.first() || message.author;
		message.channel.send(new MessageAttachment(user.displayAvatarURL())).catch(err => { console.error(err); });
	},
};