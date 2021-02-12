const config = require('../config.json');

module.exports = {
	name: 'setlanguage',

	execute(bot, message, command, db, lang, language, prefix, args, serverSettings) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch(err => { console.error(err); });
		}
		else {
			const availableLangs = ['pt', 'en'],
				newLanguage = args[0].toLowerCase(),
				ref = db.collection('definicoes').doc(message.guild.id);

			if (!availableLangs.includes(newLanguage)) return message.reply(`${lang.setlanguage.noLanguage}\`${prefix}help setlanguage\`${lang.forMoreInfo}`).catch(err => { console.error(err); });

			ref.get().then(doc => {
				if (!doc.exists) {
					ref.set({
						settings: config.settings,
					}, { merge: true }).catch(err => { console.error(err); });
				}

				const oldLanguage = doc.get('settings').language || config.settings.language;

				if (newLanguage == oldLanguage) {
					return message.reply(lang.error.sameLanguage).catch(err => { console.error(err); });
				}
				else {
					serverSettings.language = newLanguage;
					ref.set({
						settings: { 'language': newLanguage },
					}, { merge: true }).catch(err => { console.error(err); });
				}
				lang = require(`../lang/${newLanguage}.json`);
				message.channel.send(`${lang.setlanguage.isNow}`).catch(err => { console.error(err); });
			});
		}
	},
};
