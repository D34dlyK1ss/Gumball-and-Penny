module.exports = {
	name: 'give',
	category: 'Economia e Perfil',
	description: 'Dá dinheiro a alguém!',
	usage: 'give [@membro] [quantia]',

	execute(bot, message, command, args, db, prefix) {

		function getUserFromMention(mention) {

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		const donor = message.author;
		if (!args || args == '') return message.reply('não mencionaste ninguém!').catch();
		const user = getUserFromMention(args [0]),
			refD = db.collection('perfis').doc(donor.id);
		let amount = parseInt(args[1]);

		refD.get().then(docD => {
			if (!docD.exists) {
				message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`).catch();
			}
			else if (user == null || !Number.isInteger(amount)) {
				message.reply('Sintaxe errada! Como usar: +give [@membro] [quantia]').catch();
			}
			else {
				const refU = db.collection('perfis').doc(user.id);

				refU.get().then(docU => {
					if (user == bot.user) {
						return message.reply('Obrigado, mas vais precisar mais desse dinheiro do que nós! 😁').catch();
					}
					else if (user.bot) {
						return message.reply('os bots não têm perfis!').catch();
					}
					else if (args[1] == null || args[1] == '' || args == user) {
						return message.reply(`Sintaxe errada! Como usar: \`${prefix}give [@membro] [quantidade]\``).catch();
					}
					else if (!docU.exists) {
						return message.reply(`${user.tag} ainda não criou um perfil!`).catch();
					}
					else {
						const balD = docD.get('balance'),
							balU = docU.get('balance');

						if (amount > balD) {
							return message.reply('não tens dinheiro suficiente!').catch();
						}
						else if (balU == 999999999) {
							return message.reply(`não podes dar dinheiro a ${user.tag}! 😧`).catch();
						}
						else {

							let newBalU = balU + amount;

							if ((balU + amount) > 999999999) {
								newBalU = 999999999;
								amount = newBalU - balU;
							}

							refU.update({
								balance: newBalU,
							}).then(() => {
								refD.update({
									balance: balD - amount,
								}).then(() => {
									message.reply(`deste **¤${amount}** a ${user}!`).catch();
								});
							});
						}
					}
				});
			}
		});
	},
};