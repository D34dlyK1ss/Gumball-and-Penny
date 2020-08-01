module.exports = {
	name: 'kiss',
	category: 'Ações',
	description: 'Beija!',
	usage: '`+kiss [opcional - @membro]`',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			message.channel.send(`${message.author} beijou-se a si mesmo?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			message.channel.send(`${message.author} beijou-nos! 😳`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} beijou o/a ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};