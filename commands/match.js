/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */

const config = require('../config.json');
const botOwner = config.botOwner,
	lilly = config.lilly;

module.exports = {
	name: 'match',
	category: 'Diversão',
	description: 'Verifica se és compatível com alguém!',
	usage: '`+match [@membro]`',

	execute(bot, message, command, args, db) {
		const other = message.mentions.users.first();

		if (other == null) {
			message.reply('não mencionaste ninguém!');
		}
		else {
			const last = parseInt(message.member.id.slice(-1)),
				otherLast = parseInt(other.id.slice(-1));
			let number = `${Math.abs(last - otherLast) * 30}`;

			if (number > 100) number = number.substr(1);

			if (other == message.author) {
				message.reply('não podes usar este comando em ti!');
			}
			else if (other == bot.user) {
				message.channel.send('Hey, nós já somos um par! 😠');
			}
			else if (other.bot) {
				message.reply('isso não vai funcionar com um bot! 😂');
			}
			else {
				message.reply(`tu és **${number}%** compatível com ${other}!`);
			}
		}
	},
};