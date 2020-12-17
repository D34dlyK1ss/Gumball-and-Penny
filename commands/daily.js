const moment = require('moment');

module.exports = {
	name: 'daily',
	aliases: ['d'],

	execute(bot, message, command, db, lang, language, supportServer, prefix) {
		moment.locale(`${lang}`);
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			daily = 250;

		ref.get().then(doc => {
			const today = moment().format('L'),
				lastDaily = doc.get('lastDaily');
			if (!doc.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
			}
			else if (today == lastDaily) {
				return message.reply(`${lang.daily.againIn + moment().endOf('day').fromNow()}.`).catch();
			}
			else {
				const bal = doc.get('balance');

				if ((bal + daily) > 999999999) {
					message.reply(lang.error.noAdd).catch();
				}
				else {
					ref.update({
						balance: (bal + daily),
						lastDaily: today,
					}).then(() => {
						message.reply(`${lang.daily.received}**${daily}**${lang.daily.toGetMore}\`${prefix}vote\``).catch();
					}).catch(err => { console.error(err); });
				}
			}
		});
	},
};
