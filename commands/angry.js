module.exports = {
	name: 'angry',

	execute(bot, message, command, db, lang) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user || user == message.author) {
			return message.channel.send(`${message.author}${lang.angry.gotAngry}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author}${lang.angry.gotAngryWithUs} 😧`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(`${message.author}${lang.angry.gotAngryWith}${user}!`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
	},
};