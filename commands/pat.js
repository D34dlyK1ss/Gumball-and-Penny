module.exports = {
	name: 'pat',

	execute(bot, message, command, db, lang) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author}${lang.pat.pattedSelf}`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author}${lang.pat.pattedUs} 😊`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author}${lang.pat.patted}${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};