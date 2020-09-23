/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */

const config = require('../config.json');
const botOwner = config.botOwner,
	lilly = config.lilly;

module.exports = {
	name: 'match',
	category: 'Fun',
	description: 'Check if you\'re compatible with someone!',
	usage: 'match [@member]',

	execute(bot, message, command, args, db) {
		const other = message.mentions.users.first();

		if (!other) {
			return message.reply('you didn\'t mention anyone!');
		}
		else {
			const last = parseInt(message.member.id.slice(-1)),
				otherLast = parseInt(other.id.slice(-1));
			let number = `${Math.abs(last - otherLast) * 30}`;

			if (number > 100) number = number.substr(1);

			if (other == message.author) {
				return message.reply('you can\'t use this command on yourself!');
			}
			else if (other == bot.user) {
				return message.channel.send('Hey, we\'re a couple already! 😠');
			}
			else if (other.bot) {
				return message.reply('that\'s not going to work with a bot! 😂');
			}
			else {
				message.reply(`you are **${number}%** compatible with ${other}!`);
			}
		}
	},
};