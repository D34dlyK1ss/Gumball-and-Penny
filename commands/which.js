const which = require('../src/data/which.json');

module.exports = {
	name: 'which',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		args = args.join(' ');
		args = args.toLowerCase();
		const last = message.member.id.slice(-1);

		if (args == null || args == '' || !which[args]) {
			return message.reply(`${lang.which.noSelect}\`${prefix}help which\`${lang.forMoreInfo}`).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(`${which[args][last]}!`, { files: [`img/which/${args} (${last}).jpg`] }).catch(err => { console.error(err); });
		}
	},
};