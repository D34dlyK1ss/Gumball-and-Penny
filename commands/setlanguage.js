const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setlanguage',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes, languages) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch();
		}
		else if (!args || args == '') {
			return message.reply(lang.error.noLangChosen).catch();
		}
		else {
			const newLanguage = args[0].toLowerCase(),
				ref = db.collection('servidores').doc(message.guild.id);
			const oldLanguage = ref.get('language') || config.language;

			if (oldLanguage == newLanguage) {
				return message.reply(lang.error.sameLanguage).catch();
			}
			else if (newLanguage == config.language) {
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
			lang = require(`../languages/${language}.json`);
			message.channel.send(`${lang.setlanguage.isNow}`).catch();
		}
	},
};
