module.exports = {
	name: 'vote',
	category: 'Economia e Perfil',
	description: 'Vota pelo bot!',
	usage: 'vote',

	execute(bot, message) {
		message.channel.send('Vota pelo bot a cada 12h para receberes ¤150!\nhttps://top.gg/bot/679041548955942914/vote');
	},
};
