const moment = require('moment');
moment.locale('pt');

module.exports = {
	name: 'daily',
	aliases: ['d'],
	category: 'Economia',
	description: 'Receberás ¤250 a cada dia!',
	usage: '`+daily`',

	execute(bot, message, command, args, db) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			daily = 250;

		ref.get().then(doc => {
			const today = moment().format('L'),
				lastDaily = doc.get('lastDaily');
			if (!doc.exists) {
				message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (today == lastDaily) {
				message.reply(`poderás receber o teu montante diário outra vez ${moment().endOf('day').fromNow()}.`);
			}
			else {
				const bal = doc.get('balance');

				if ((bal + daily) > 999999999) {
					message.reply('não podes receber mais dinheiro! 😧');
				}
				else {
					ref.update({
						balance: (bal + daily),
						lastDaily: today,
					}).then(() => {
						message.reply('recebeste os teus ¤250 diários!');
					}).catch(err => { console.error(err); });
				}
			}
		}).catch(err => { console.error(err); });
	},
};
