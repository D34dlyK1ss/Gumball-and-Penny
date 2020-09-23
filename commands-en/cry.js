module.exports = {
	name: 'cry',
	category: 'Actions',
	description: 'Cry!',
	usage: 'cry [optional - @member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return message.channel.send(`${message.author} is crying!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} is crying!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} is crying because of us! 😦`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${user} made ${message.author} cry!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};