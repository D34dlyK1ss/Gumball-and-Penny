module.exports = {
	name: 'pat',
	category: 'Ações',
	description: 'Acaricia!',
	usage: '`+pat [@membro]`',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} acariciou-se?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} acariciou-nos! 😊`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} acariciou o/a ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};