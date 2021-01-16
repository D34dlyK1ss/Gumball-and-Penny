const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setprefix',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch(err => { console.error(err); });
		}
		else if (!args || args == '') {
			return message.reply(lang.error.noPrefixChosen).catch(err => { console.error(err); });
		}
		else {
			const newPrefix = args[0].toLowerCase(),
				ref = db.collection('servidores').doc(message.guild.id);

			ref.get().then(doc => {
				const oldPrefix = doc.get('prefix') || config.prefix;

				if (newPrefix == oldPrefix) {
					return message.reply(lang.error.samePrefix).catch(err => { console.error(err); });
				}
				else if (newPrefix == config.prefix) {
					prefixes[message.guild.id] = config.prefix;
					ref.set({
						prefix: FieldValue.delete(),
					}, { merge: true }).catch(err => { console.error(err); });
				}
				else {
					prefixes[message.guild.id] = newPrefix;
					ref.set({
						prefix: newPrefix,
					}, { merge: true }).catch(err => { console.error(err); });
				}
				message.channel.send(`${lang.setprefix.isNow}\`${newPrefix}\``).catch(err => { console.error(err); });
			});
		}
	},
};
