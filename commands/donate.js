module.exports = {
	name: 'donate',
	category: 'Economia',
	description: 'Doa dinheiro a alguém!',
	usage: '`+donate [@membro] [quantia]`',

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
						message.channel.send('Obrigado, mas vais precisar mais desse dinheiro do que nós! 😁');
					}
					else if (user.bot) {
						message.reply('os bots não têm perfis!');
					}
					else if (args[1] == null || args[1] == '' || args == user) {
						message.channel.send('Sintaxe errada! Como usar: `+donate [@membro] [quantidade]`');
					}
					else if (!docU.exists) {
						message.channel.send(`${user} ainda não criou um perfil!`);
					}
					else {
						const balD = docD.get('balance'),
							balU = docU.get('balance'),
							amount = parseInt(args[1]);

						if (amount > balD) {
							message.reply('não tens dinheiro suficiente!');
						}
						else if ((balU + amount) > 999999999) {
							message.reply(`não podes doar dinheiro a ${user.tag}! 😧`);
						}
						else {
							refU.update({
								balance: balU + amount,
							}).then(() => {
								refD.update({
									balance: balD - amount,
								}).then(() => {
									message.reply(`doaste **¤${amount}** a ${user}!`);
								}).catch(err => { console.error(err); });
							}).catch(err => { console.error(err); });
						}
					}
				});
			}
		});
	},
};