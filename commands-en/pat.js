module.exports = {
	name: 'pat',
	category: 'Ações',
	description: 'Pat someone!',
	usage: 'pat [@member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} has pat themselves?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} has pat us! 😊`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} has pat ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};