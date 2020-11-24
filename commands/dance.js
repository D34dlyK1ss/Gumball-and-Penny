module.exports = {
	name: 'dance',
	category: 'Ações',
	description: 'Dança!',
	usage: 'dance [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return message.channel.send(`${message.author} está a dançar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} está a dançar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} está a dançar para nós!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author} está a dançar para ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};