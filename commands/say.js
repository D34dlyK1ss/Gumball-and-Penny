module.exports = {
	name: 'say',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		if (args == null || args == '') {
			return message.reply(lang.error.noMessage).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (args[0].startsWith('http')) {
			return message.reply(lang.error.noLinks).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(args.join(' ')).catch(err => { console.error(err); });
		}
	},
};
