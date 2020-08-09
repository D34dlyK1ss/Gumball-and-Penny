module.exports = {
	name: 'give',
	category: 'Perfil',
	description: 'Dá dinheiro a alguém!',
	usage: '`+give [@membro] [quantia]`',

	execute(bot, message, command, args, db) {
		const donor = message.author;
		const refD = db.collection('perfis').doc(donor.id);

		refD.get().then(docD => {
			if (!docD.exists) {
				message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (args == null || args == '') {
				message.reply('não mencionaste ninguém!');
			}
			else {
				const user = message.mentions.users.first();
				const refU = db.collection('perfis').doc(user.id);

				refU.get().then(docU => {
					if (user == bot.user) {
						message.reply('Obrigado, mas vais precisar mais desse dinheiro do que nós! 😁');
					}
					else if (user.bot) {
						message.reply('os bots não têm perfis!');
					}
					else if (args[1] == null || args[1] == '' || args == user) {
						message.reply('Sintaxe errada! Como usar: `+give [@membro] [quantidade]`');
					}
					else if (!docU.exists) {
						message.reply(`${user.tag} ainda não criou um perfil!`);
					}
					else {
						const balD = docD.get('balance'),
							balU = docU.get('balance'),
							amount = parseInt(args[1]);

						if (amount > balD) {
							message.reply('não tens dinheiro suficiente!');
						}
						else if ((balU + amount) > 999999999) {
							message.reply(`não podes dar dinheiro a ${user.tag}! 😧`);
						}
						else {
							refU.update({
								balance: balU + amount,
							}).then(() => {
								refD.update({
									balance: balD - amount,
								}).then(() => {
									message.reply(`deste **¤${amount}** a ${user}!`);
								}).catch(err => { console.error(err); });
							}).catch(err => { console.error(err); });
						}
					}
				});
			}
		});
	},
};