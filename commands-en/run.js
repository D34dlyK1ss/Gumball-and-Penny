module.exports = {
	name: 'run',
	category: 'Actions',
	description: 'Run!',
	usage: 'run [optional - @member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return message.channel.send(`${message.author} ran away!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} ran away from themselves?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} ran away from us!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} ran away from ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};