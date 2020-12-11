module.exports = {
	name: 'which',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		args = args.join(' ');
		args = args.toLowerCase();
		const last = message.member.id.slice(-1),
			which = require('../which.json');

		if (args == null || args == '' || !which[args]) {
			return message.reply(`${lang.which.noSelect}\`${prefix}help which\`${lang.forMoreInfo}`).catch();
		}
		else {
			message.channel.send(`${which[args][last]}!`, { files: [`images/which/${args} (${last}).jpg`] }).catch();
		}
	},
};