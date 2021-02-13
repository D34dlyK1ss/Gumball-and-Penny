const moment = require('moment');

module.exports = {
	name: 'daily',
	aliases: ['d'],

	execute(bot, message, command, db, lang, language, prefix) {
		moment.locale(`${language}`);
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			daily = 300;

		ref.get().then(doc => {
			const today = moment().format('L'),
				lastDaily = doc.get('lastDaily');
			if (!doc.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
			}
			else if (today == lastDaily) {
				return message.reply(`${lang.daily.againIn + moment().endOf('day').fromNow()}.`).catch(err => { console.error(err); });
			}
			else {
				const bal = doc.get('balance');

				if ((bal + daily) > 1000000) {
					message.reply(lang.error.noAdd).catch(err => { console.error(err); });
				}
				else {
					ref.update({
						balance: (bal + daily),
						lastDaily: today,
					}).then(() => {
						message.reply(`${lang.daily.received}${daily}${lang.daily.toGetMore}\`${prefix}vote\``).catch(err => { console.error(err); });
					}).catch(err => { console.error(err); });
				}
			}
		});
	},
};
