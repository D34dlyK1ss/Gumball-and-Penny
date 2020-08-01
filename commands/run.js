module.exports = {
	name: 'run',
	category: 'Ações',
	description: 'Foge!',
	usage: '`+run [opcional - @membro]`',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			message.channel.send(`${message.author} fugiu!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} fugiu de si mesmo?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} fugiu para longe de nós!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} fugiu para longe de ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};