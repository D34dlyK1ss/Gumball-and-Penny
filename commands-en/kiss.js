module.exports = {
	name: 'kiss',
	category: 'Actions',
	description: 'Kiss someone!',
	usage: 'kiss [optional - @member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} kissed themselves?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} kissed us! 😳`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			message.channel.send(`${message.author} kissed ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};