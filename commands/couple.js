/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
module.exports = {
	name: 'match',
	category: 'Diversão',
	description: 'Verifica se és compatível com alguém!',
	usage: '`+match [@membro]`',

	execute(bot, message, command, args, db) {
		const other = message.mentions.users.first();
		const last = message.member.id.slice(-1);
		let otherLast,
			number;

		if (other == null) {
			message.reply('não mencionaste ninguém!');
		}
		else {
			otherLast = other.id.slice(-1);

			if (last >= 5 && otherLast >= 5 && last > otherLast) number = `${otherLast}${last}`;
			else if (last >= 5 && otherLast <= 5 && last > otherLast) number = `${last}${otherLast}`;
			else if (last <= 5 && otherLast >= 5 && last > otherLast) number = `${last}${otherLast}`;
			else number = `${otherLast}${last}`;


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
				message.channel.send(`Vocês têm **${number}%** de chance de dar certo!`);
			}
		}
	},
};