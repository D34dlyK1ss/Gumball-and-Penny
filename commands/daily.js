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
			const now = new Date();
			const lastdaily = doc.get('lastDaily').toDate();
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (now.getUTCFullYear() == lastdaily.getUTCFullYear() && now.getUTCMonth() == lastdaily.getUTCMonth() && now.getUTCDate() == lastdaily.getUTCDate()) {
				message.channel.send('Amanhã poderás receber o teu montante diário outra vez');
			}
			else {
				const bal = doc.get('balance');

				db.collection('perfis').doc(user.id).update({
					'balance': (bal + 250),
					'lastDaily': new Date(),
				}).then(() => {
					message.reply('recebeste os teus ¤250 diários!');
				}).catch(err => { console.error(err); });
			}
		}).catch(err => { console.error(err); });
	},
};