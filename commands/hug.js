module.exports = {
	name: 'hug',
	category: 'Ações',
	description: 'Abraça!',
	usage: '`+hug [opcional - @membro]`',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} abraçou-se?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} abraçou-nos!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} abraçou o/a ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};