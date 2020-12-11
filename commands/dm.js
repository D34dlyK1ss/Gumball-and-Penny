module.exports = {
	name: 'dm',

	execute(bot, message, command, db, lang, supportServer, prefix, args) {
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
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 5000 }); }).catch();
		}
		else if (!mention || mention == '') {
			return message.reply(lang.error.noMention).then(msg => { msg.delete({ timeout: 5000 }); }).catch();
		}
		else if (!mentionMessage || mentionMessage == '') {
			return message.reply(lang.error.noMessage).then(msg => { msg.delete({ timeout: 5000 }); }).catch();
		}
		else {
			mention.send(mentionMessage);
			message.reply(lang.sent).then(msg => { msg.delete({ timeout: 5000 }); }).catch();
		}
	},
};