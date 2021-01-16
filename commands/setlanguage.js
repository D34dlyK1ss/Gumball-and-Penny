const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setlanguage',

	async execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes, languages) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch(err => { console.error(err); });
		}
		else if (!args || args == '') {
			return message.reply(lang.error.noLangChosen).catch(err => { console.error(err); });
		}
		else {
			const availableLangs = ['pt', 'en'],
				newLanguage = args[0].toLowerCase(),
				ref = db.collection('servidores').doc(message.guild.id);

			if (!availableLangs.includes(newLanguage)) return message.reply(`${lang.setlanguage.noLanguage}\`${prefix}help setlanguage\`${lang.forMoreInfo}`).catch(err => { console.error(err); });

			ref.get().then(doc => {
				const oldLanguage = doc.get('language') || config.language;

				if (newLanguage == oldLanguage) {
					return message.reply(lang.error.sameLanguage).catch(err => { console.error(err); });
				}
				else if (newLanguage == config.language) {
					languages[message.guild.id] = config.language;
					ref.set({
						language: FieldValue.delete(),
					}, { merge: true }).catch(err => { console.error(err); });
				}
				else {
					languages[message.guild.id] = newLanguage;
					ref.set({
						language: newLanguage,
					}, { merge: true }).catch(err => { console.error(err); });
				}
				lang = require(`../lang/${newLanguage}.json`);
				message.channel.send(`${lang.setlanguage.isNow}`).catch(err => { console.error(err); });
			});
		}
	},
};
