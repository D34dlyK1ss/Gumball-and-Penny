module.exports = {
	name: 'angry',
	category: 'Ações',
	description: 'Fica chateado!',
	usage: 'angry [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return message.channel.send(`${message.author} chateou-se!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} chateou-se!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} chateou-se connosco! 😧`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author} chateou-se com ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};