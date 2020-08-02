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
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			const today = moment().format('L');
			const lastDaily = doc.get('lastDaily');
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (today == lastDaily) {
				message.channel.send(`Poderás receber o teu montante diário outra vez ${moment().endOf('day').fromNow()}.`);
			}
			else {
				const bal = doc.get('balance');

				doc.update({
					'balance': (bal + 250),
					'lastDaily': today,
				}).then(() => {
					message.reply('recebeste os teus ¤250 diários!');
				}).catch(err => { console.error(err); });
			}
		}).catch(err => { console.error(err); });
	},
};
