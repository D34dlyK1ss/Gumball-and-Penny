const moment = require('moment');

module.exports = {
	name: 'daily',
	aliases: ['d'],
	category: 'Economy and Profile',
	description: 'You\'ll earn ¤250 each day!',
	usage: 'daily',

	execute(bot, message, command, args, db, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			daily = 250;

		ref.get().then(doc => {
			const today = moment().format('L'),
				lastDaily = doc.get('lastDaily');
			if (!doc.exists) {
				return message.reply(`you haven't created a profile yet! To create one use \`${prefix}profile create\`!`);
			}
			else if (today == lastDaily) {
				return message.reply(`you can get money again ${moment().endOf('day').fromNow()}.`);
			}
			else {
				const bal = doc.get('balance');

				if ((bal + daily) > 999999999) {
					message.reply('you can\'t get any more money on your bank account! 😧');
				}
				else {
					ref.update({
						balance: (bal + daily),
						lastDaily: today,
					}).then(() => {
						message.reply(`you received your daily ¤250! To get more vote for us with \`${prefix}vote\``);
					}).catch(err => { console.error(err); });
				}
			}
		}).catch(err => { console.error(err); });
	},
};
