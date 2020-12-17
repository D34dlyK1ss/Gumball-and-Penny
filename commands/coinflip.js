const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'coinflip',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			const money = parseInt(args[1]);
			if (!doc.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
			}
			else if (!Number.isInteger(money) || (args[0] != lang.coinflip.heads && args[0] != lang.coinflip.tails)) {
				return message.channel.send(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch();
			}
			else {
				const bal = doc.get('balance'),
					least = 50,
					most = 1000;

				if ((bal + money) > 999999999) {
					return message.reply(lang.error.noAdd).catch();
				}
				else if (money > bal) {
					return message.reply(lang.error.noMoney).catch();
				}
				else if (money < least) {
					return message.reply(`${lang.coinflip.betAtLeast + least}!`).catch();
				}
				else if (money > most) {
					return message.reply(`${lang.coinflip.betAtMost + most}!`).catch();
				}
				else {
					const value = Math.round(Math.random()),
						guess = args[0].toLowerCase();
					let res;

					const attachment = new MessageAttachment('img/coinflip/animation.gif');

					message.channel.send(attachment).then(msg => msg.delete({ timeout: 3000 }).then(() => {
						if (value == 0) res = lang.coinflip.heads;
						if (value == 1) res = lang.coinflip.tails;

						message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`, { files: [`img/coinflip/${res}.gif`] });

						if (res != guess) {
							ref.update({
								balance: (bal - money),
							}).then(() => { return message.reply(`${lang.coinflip.lost + money}!`); }).catch();
						}
						else if (res == guess) {
							const won = money * 2;
							ref.update({
								balance: (bal + won),
							}).then(() => { message.reply(`${lang.coinflip.won + won}!`); }).catch();
						}
					}));
				}
			}
		});
	},
};