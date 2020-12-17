module.exports = {
	name: 'laugh',

	execute(bot, message, command, db, lang) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return message.channel.send(`${message.author}${lang.laugh.isLaughing}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author}${lang.laugh.isLaughingFromSelf}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author}${lang.laugh.isLaughingFromUs} 😅`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author}${lang.laugh.isLaughingFrom}${user}!`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};