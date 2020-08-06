module.exports = {
	name: 'donate',
	category: 'Doações',
	description: 'Envia uma doação ao nosso criador!',
	usage: '`+donate`',

	execute(bot, message) {
		message.channel.send('De momento podes doar um café ☕\nhttps://ko-fi.com/d34dlyk1ss');
	},
};