module.exports = {
	name: 'laugh',
	category: 'Ações',
	description: 'Ri-te!',
	usage: 'laugh [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return message.channel.send(`${message.author} está a rir-se!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} está a rir-se de si mesmo!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} está a rir-se de nós!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} está a rir-se de ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};