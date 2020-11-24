module.exports = {
	name: 'laugh',
	category: 'Ações',
	description: 'Ri-te!',
	usage: 'laugh [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return message.channel.send(`${message.author} está a rir-se!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} está a rir-se de si mesmo!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} está a rir-se de nós!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${message.author} está a rir-se de ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};