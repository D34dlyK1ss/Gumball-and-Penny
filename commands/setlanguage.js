const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setlanguage',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes, languages) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch();
		}
		else if (!args) {
			return message.reply(lang.error.noPrefixChosen).catch();
		}
		else {
			const newLanguage = args[0].toLowerCase(),
				ref = db.collection('servidores').doc(message.guild.id);
			if (newLanguage == config.language) {
				languages[message.guild.id] = config.language;
				ref.update({
					language: FieldValue.delete(),
				}).catch(err => { console.error(err); });
			}
			else {
				languages[message.guild.id] = newLanguage;
				ref.update({
					language: newLanguage,
				}).catch(err => { console.error(err); });
			}
			message.channel.send(`${lang.language.isNow}\`${newLanguage}\``).catch();
		}
	},
};
