const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setprefix',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch();
		}
		else if (!args) {
			return message.reply(lang.error.noPrefixChosen).catch();
		}
		else {
			const newPrefix = args[0].toLowerCase(),
				ref = db.collection('servidores').doc(message.guild.id);
			if (newPrefix == config.prefix) {
				prefixes[message.guild.id] = config.prefix;
				ref.update({
					prefix: FieldValue.delete(),
				}).catch(err => { console.error(err); });
			}
			else {
				prefixes[message.guild.id] = newPrefix;
				ref.update({
					prefix: newPrefix,
				}).catch(err => { console.error(err); });
			}
			message.channel.send(`${lang.setprefix.isNow}\`${newPrefix}\``).catch();
		}
	},
};
