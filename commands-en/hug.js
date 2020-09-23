module.exports = {
	name: 'hug',
	category: 'Actions',
	description: 'Hug someone!',
	usage: 'hug [optional - @member]',

	execute(bot, message, command) {
		const user = message.mentions.users.first();
		const rnd = Math.round(Math.random() * 5);

		if (!user) {
			return;
		}
		else if (user == message.author) {
			return message.channel.send(`${message.author} hugged themselves?`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else if (user == bot.user) {
			return message.channel.send(`${message.author} hugged us! 🤗`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
		else {
			return message.channel.send(`${message.author} hugged ${user}!`, { files: [`images/actions/${command.name} (${rnd}).gif`] });
		}
	},
};