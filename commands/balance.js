const config = require('../config.json');

module.exports = {
	name: 'balance',
	aliases: ['bal'],
	category: 'Perfil',
	description: 'Verifica o teu capital!',
	usage: '`+balance`',

	execute(bot, message, command, args, db) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			botOwner = config.botOwner,
			lilly = config.lilly;

		ref.get().then(doc => {
			if (!doc.exists) {
				message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else {
				const bal = doc.get('balance');

				switch (args[0]) {
				case 'add':
					if (user.id == botOwner || user.id == lilly) {
						const amount = parseInt(args[1]);

						if (!amount) {
							message.reply('não indicaste uma quantia!');
						}
						else if ((bal + amount) > 999999999) {
							message.reply('não podes adicionar mais dinheiro à tua conta bancária! 😧');
						}
						else {
							ref.update({
								balance: bal + amount,
							}).then(() => {
								message.reply(`**¤${amount}** foram adicionados à tua conta bancária!`);
							}).catch(err => { console.error(err); });
						}
					}
					else {
						message.reply('não tens permissão para usar este comando! 💢');
					}
					break;
				default:
					message.reply(`tens **¤${bal}**`);
					break;
				}
			}
		}).catch(err => { console.error(err); });
	},
};
