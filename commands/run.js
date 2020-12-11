module.exports = {
	name: 'run',

	execute(bot, message, command, db, lang) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user || user == message.author) {
			return message.channel.send(`${message.author}${lang.run.ranAway}`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author}${lang.run.ranAwayFromUs} 🤨`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author}${lang.run.ranAwayFrom}${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};