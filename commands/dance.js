module.exports = {
	name: 'dance',
	category: 'Ações',
	description: 'Dança!',
	usage: '`+dance [opcional - @membro]`',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			message.channel.send(`${message.author} está a dançar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} está a dançar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} está a dançar para nós!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} está a dançar para ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};