module.exports = {
	name: 'slap',
	category: 'Ações',
	description: 'Dá uma chapada!',
	usage: '`+slap [opcional - @membro]`',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} deu uma chapada a si mesmo?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} deu-nos uma chapada! 😠`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} deu uma chapada a ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};