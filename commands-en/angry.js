module.exports = {
	name: 'angry',
	category: 'Actions',
	description: 'Get angry!',
	usage: 'angry [optional - @member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return message.channel.send(`${message.author} got angry!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} got angry!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} got mad at us! 😧`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} got mad at ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};