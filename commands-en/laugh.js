module.exports = {
	name: 'laugh',
	category: 'Actions',
	description: 'Laugh!',
	usage: 'laugh [optional - @member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return message.channel.send(`${message.author} is laughing!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} is laughing at themselves!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} is laughing at us!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} is laughing at ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};