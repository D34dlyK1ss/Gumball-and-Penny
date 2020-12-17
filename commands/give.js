module.exports = {
	name: 'give',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		const donor = message.author;
		if (!args || args == '') return message.reply(lang.error.noMention).catch(err => { console.error(err); });
		const user = message.mentions.users.first(),
			refD = db.collection('perfis').doc(donor.id);
		let amount = Math.abs(parseInt(args[1]));

		refD.get().then(docD => {
			if (!docD.exists) {
				message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
			}
			else if (user == null || !Number.isInteger(amount)) {
				message.reply(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch(err => { console.error(err); });
			}
			else {
				const refU = db.collection('perfis').doc(user.id);

				refU.get().then(docU => {
					if (user == bot.user) {
						return message.reply(`${lang.give.thanksBut} 😁`).catch(err => { console.error(err); });
					}
					else if (user.bot) {
						return message.reply(lang.botsNoProfile).catch(err => { console.error(err); });
					}
					else if (args[1] == null || args[1] == '' || args == user) {
						return message.reply(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch(err => { console.error(err); });
					}
					else if (!docU.exists) {
						return message.reply(`${user.tag}${lang.error.userNoProfile}`).catch(err => { console.error(err); });
					}
					else {
						const balD = docD.get('balance'),
							balU = docU.get('balance');

						if (amount > balD) {
							return message.reply(lang.error.noMoney).catch(err => { console.error(err); });
						}
						else if (balU == 999999999) {
							return message.reply(`${lang.error.noGive}${user.tag}! 😧`).catch(err => { console.error(err); });
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
									message.reply(`${lang.give.youGave}**¤${amount}**${lang.give.to}${user}!`).catch(err => {console.error(err); });
								});
							});
						}
					}
				});
			}
		});
	},
};