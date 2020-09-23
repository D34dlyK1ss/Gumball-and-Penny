const config = require('../config.json');

module.exports = {
	name: 'balance',
	aliases: ['bal'],
	category: 'Economy and Profile',
	description: 'Check your balance!',
	usage: 'balance',

	execute(bot, message, command, args, db, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id),
			botOwner = config.botOwner,
			lilly = config.lilly;

		ref.get().then(doc => {
			if (!doc.exists) {
				return message.reply(`you haven't created a profile yet! To create one use \`${prefix}profile create\`!`);
			}
			else {
				const bal = doc.get('balance');

				switch (args[0]) {
				case 'add':
					if (user.id == botOwner || user.id == lilly) {
						let amount = parseInt(args[1]);

						if (!amount) {
							return message.reply('you did\'t indicate an amount!');
						}
						else if (bal == 999999999) {
							return message.reply('you can\'t add more funds to you bank account! 😧');
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
								return message.reply(`**¤${amount}** were added to your bank account!`);
							});
						}
					}
					else {
						message.reply('you don\'t have permission to use this command! 💢');
					}
					break;
				default:
					message.reply(`you have **¤${bal}**`);
					break;
				}
			}
		}).catch(err => { console.error(err); });
	},
};
