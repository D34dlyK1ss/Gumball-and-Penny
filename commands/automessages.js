const config = require('../config.json');

module.exports = {
	name: 'automessages',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes, languages, settings, serverSettings) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch(err => { console.error(err); });
		}
		else {
			const ref = db.collection('definicoes').doc(message.guild.id);

			ref.get().then(doc => {
				const dbSettings = doc.get('settings') || config.settings;
				const boolean = dbSettings.automessages;
				let toggle = '';

				serverSettings.automessages = !boolean;
				!boolean === true ? toggle = `${lang.enabled}` : toggle = `${lang.disabled}`;

				ref.set({
					settings: serverSettings,
				}, { merge: true }).catch(err => { console.error(err); });
				return message.channel.send(`${lang.automessages.areNow}**${toggle}**`).catch(err => { console.error(err); });
			});
		}
	},
};
