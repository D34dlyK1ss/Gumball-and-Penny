const config = require('../config.json');

module.exports = {
	name: 'balance',
	aliases: ['bal'],
	category: 'Economia e Perfil',
	description: 'Verifica o teu capital!',
	usage: 'balance',

	execute(bot, message, command, args, db, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			botOwner = config.botOwner,
			lilly = config.lilly;

		ref.get().then(doc => {
			if (!doc.exists) {
				return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
			}
			else {
				const bal = doc.get('balance');

				switch (args[0]) {
				case 'add':
					if (user.id == botOwner || user.id == lilly) {
						let amount = parseInt(args[1]);

						if (!amount) {
							return message.reply('não indicaste uma quantia!');
						}
						else if (bal == 999999999) {
							return message.reply('não podes adicionar mais dinheiro à tua conta bancária! 😧');
						}
						else {
							let newBal;

							if ((bal + amount) > 999999999) {
								newBal = 999999999;
								amount = newBal - bal;
							}

							ref.update({
								balance: newBal,
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
