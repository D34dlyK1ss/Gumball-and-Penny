module.exports = {
	name: 'angry',
	category: 'Ações',
	description: 'Fica chateado!',
	usage: 'angry [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			message.channel.send(`${message.author} chateou-se!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} chateou-se!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} chateou-se connosco! 😧`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} chateou-se com ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};