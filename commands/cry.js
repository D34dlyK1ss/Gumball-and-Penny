module.exports = {
	name: 'cry',

	execute(bot, message, command, db, lang) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user || user == message.author) {
			return message.channel.send(`${message.author}${lang.cry.isCrying}`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author}${lang.cry.isCryingBecauseOfUs} 😦`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${user}${lang.cry.made}${message.author}${lang.cry.cry}`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};