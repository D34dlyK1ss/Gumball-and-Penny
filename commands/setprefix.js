const config = require('../config.json');

module.exports = {
	name: 'setprefix',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args, serverSettings) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch(err => { console.error(err); });
		}
		else if (!args || args == '') {
			return message.reply(lang.error.noPrefixChosen).catch(err => { console.error(err); });
		}
		else {
			const newPrefix = args[0].toLowerCase(),
				ref = db.collection('definicoes').doc(message.guild.id);

			ref.get().then(doc => {
				const oldPrefix = doc.get('prefix') || config.prefix;

				if (newPrefix == oldPrefix) {
					return message.reply(lang.error.samePrefix).catch(err => { console.error(err); });
				}
				else {
					serverSettings.prefix = newPrefix;
					ref.set({
						settings: { 'prefix': newPrefix },
					}, { merge: true }).catch(err => { console.error(err); });
				}
				message.channel.send(`${lang.setprefix.isNow}\`${newPrefix}\``).catch(err => { console.error(err); });
			});
		}
	},
};
