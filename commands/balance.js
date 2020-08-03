module.exports = {
	name: 'balance',
	aliases: ['bal'],
	category: 'Economia',
	description: 'Verifica o teu capital!',
	usage: '`+balance`',

	execute(bot, message, command, args, db) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else {
				const bal = doc.get('balance');

				message.channel.send(`Tens **¤${bal}**`);
			}
		}).catch(err => { console.error(err); });
	},
};
