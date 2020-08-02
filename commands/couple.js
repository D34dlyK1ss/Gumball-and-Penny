/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
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
			const last = Number(`${message.member.id.slice(-1)}`),
				otherLast = Number(`${other.id.slice(-1)}`);

			const number = `${last + otherLast}0`;

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
				message.channel.send(`Tu és **${number}%** compatível com ${other}!`);
			}
		}
	},
};