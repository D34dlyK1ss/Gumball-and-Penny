module.exports = {
	name: 'random',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		let rnd;
		if (args == null || args == '') {
			rnd = Math.floor(Math.random() * 100) + 1;
		}
		else if (!Number.isInteger(rnd)) {
			return message.reply(lang.error.notANumber).catch();
		}
		else {
			rnd = Math.floor(Math.random() * args) + 1;
		}
		message.channel.send(`${rnd}!`).catch();
	},
};