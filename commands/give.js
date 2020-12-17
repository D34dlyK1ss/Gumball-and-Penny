module.exports = {
	name: 'give',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {

		function getUserFromMention(mention) {

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		const donor = message.author;
		if (!args || args == '') return message.reply(lang.error.noMention).catch();
		const user = getUserFromMention(args [0]),
			refD = db.collection('perfis').doc(donor.id);
		let amount = Math.abs(parseInt(args[1]));

		refD.get().then(docD => {
			if (!docD.exists) {
				message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
			}
			else if (user == null || !Number.isInteger(amount)) {
				message.reply(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch();
			}
			else {
				const refU = db.collection('perfis').doc(user.id);

				refU.get().then(docU => {
					if (user == bot.user) {
						return message.reply(`${lang.give.thanksBut} 😁`).catch();
					}
					else if (user.bot) {
						return message.reply(lang.botsNoProfile).catch();
					}
					else if (args[1] == null || args[1] == '' || args == user) {
						return message.reply(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch();
					}
					else if (!docU.exists) {
						return message.reply(`${user.tag}${lang.error.userNoProfile}`).catch();
					}
					else {
						const balD = docD.get('balance'),
							balU = docU.get('balance');

						if (amount > balD) {
							return message.reply(lang.error.noMoney).catch();
						}
						else if (balU == 999999999) {
							return message.reply(`${lang.error.noGive}${user.tag}! 😧`).catch();
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
									message.reply(`${lang.give.youGave}**¤${amount}**${lang.give.to}${user}!`).catch();
								});
							});
						}
					}
				});
			}
		});
	},
};