const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'coinflip',
	category: 'Casino',
	description: 'Flip the coin and do your bet!',
	usage: 'coinflip [heads/tails] [quantity]',

	execute(bot, message, command, args, db, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			const money = parseInt(args[1]);
			if (!doc.exists) {
				return message.reply(`you haven't created a profile yet! To create one use \`${prefix}profile create\`!`);
			}
			else if (!Number.isInteger(money) || (args[0] != 'heads' && args[0] != 'tails')) {
				return message.channel.send(`Wrong syntax! How to use: \`${prefix}coinflip [heads/tails] [quantity]\``);
			}
			else {
				const bal = doc.get('balance');

				if ((bal + money) > 999999999) {
					return message.reply('you can\'t get more money in your bank account! 😧');
				}
				else if (money > bal) {
					return message.reply('you don\'t have enough money!');
				}
				else if (money < 50) {
					return message.reply('the minimum amount to bet is ¤50!');
				}
				else if (money > 1000) {
					return message.reply('you can\'t bet more than ¤1000!');
				}
				else {
					const value = Math.round(Math.random()),
						guess = args[0].toLowerCase();
					let res;

					const attachment = new MessageAttachment('images/coinflip/animation.gif');

					message.channel.send(attachment).then(msg => msg.delete({ timeout: 3000 }).then(() => {
						if (value == 0) res = 'heads';
						if (value == 1) res = 'tails';

						message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`, { files: [`images/coinflip/${res}.gif`] });

						if (res != guess) {
							ref.update({
								balance: (bal - money),
							}).then(() => { return message.reply(`you lost ¤${money}!`); });
						}
						else if (res == guess) {
							const won = money * 2;
							ref.update({
								balance: (bal + won),
							}).then(() => { message.reply(`you won ¤${won}!`); });
						}
					}));
				}
			}
		}).catch(err => { console.error(err); });
	},
};