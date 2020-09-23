module.exports = {
	name: 'dm',
	category: 'Secret',
	description: 'We\'ll send a direct message to a server member',
	usage: 'dm [@member] [message]',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		const mention = getUserFromMention(args[0]);
		args.shift();
		const mentionMessage = args.join(' ');
		message.delete();

		if (!message.member.hasPermission('MANAGE_GUILD')) {
			return message.reply('you don\'t have permission to use this command! 💢').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else if (!mention || mention == '') {
			return message.reply('you didn\'t mention anyone!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else if (!mentionMessage || mentionMessage == '') {
			return message.reply('you didn\'t write any message!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else {
			mention.send(mentionMessage);
			message.reply('sent!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
	},
};