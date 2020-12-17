module.exports = {
	name: 'hug',

	execute(bot, message, command, db, lang) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author}${lang.hug.huggedSelf}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author}${lang.hug.huggedUs} 🤗`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
		else {
			return message.channel.send(`${message.author}${lang.hug.hugged}${user}!`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
		}
	},
};