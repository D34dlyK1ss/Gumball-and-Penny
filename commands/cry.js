module.exports = {
	name: 'cry',
	category: 'Ações',
	description: 'Chora!',
	usage: 'cry [opcional - @membro]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.floor(Math.random() * 6);

		if (!user) {
			return message.channel.send(`${message.author} está chorar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} está chorar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} está a chorar por cause de nós! 😦`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
		else {
			message.channel.send(`${user} fez ${message.author} chorar!`, { files: [`images/actions/${command.name} (${rnd}).gif`] }).catch();
		}
	},
};