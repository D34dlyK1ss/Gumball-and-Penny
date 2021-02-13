module.exports = {
	name: 'vote',

	execute(bot, message) {
		message.channel.send('https://top.gg/bot/679041548955942914/vote').catch(err => { console.error(err); });
	},
};
