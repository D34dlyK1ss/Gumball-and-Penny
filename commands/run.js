module.exports = {
	name: 'run',
	category: 'Ações',
	description: 'Foge!',
	usage: 'run [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return message.channel.send(`${message.author} fugiu!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} fugiu de si mesmo?`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} fugiu para longe de nós!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author} fugiu para longe de ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};