module.exports = {
	name: 'ping',
	category: 'Utilidade',
	description: 'Uhm... pong?',
	usage: 'ping',

	execute(bot, message) {
		message.reply('Pong!');
	},
};