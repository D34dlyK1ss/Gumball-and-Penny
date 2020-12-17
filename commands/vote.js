module.exports = {
	name: 'vote',

	execute(bot, message, command, db, lang) {
		message.channel.send(`${lang.vote.vote}\nhttps://top.gg/bot/679041548955942914/vote`).catch(err => { console.error(err); });
	},
};
