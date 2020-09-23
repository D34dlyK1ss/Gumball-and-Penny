const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'coinflip',
	category: 'Casino',
	description: 'Roda a moeda e aposta no que vai calhar!',
	usage: 'coinflip [cara/coroa] [quantidade]',

	execute(bot, message, command, args, db, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			const money = parseInt(args[1]);
			if (!doc.exists) {
				return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
			}
			else if (!Number.isInteger(money) || (args[0] != 'cara' && args[0] != 'coroa')) {
				return message.channel.send(`Sintaxe errada! Como usar: \`${prefix}coinflip [cara/coroa] [quantidade]\``);
			}
			else {
				const bal = doc.get('balance');

				if ((bal + money) > 999999999) {
					return message.reply('não podes ganhar mais dinheiro! 😧');
				}
				else if (money > bal) {
					return message.reply('não tens dinheiro suficiente!');
				}
				else if (money < 50) {
					return message.reply('tens de apostar no mínimo ¤50!');
				}
				else if (money > 1000) {
					return message.reply('não podes apostar mais que ¤1000!');
				}
				else {
					const value = Math.round(Math.random()),
						guess = args[0].toLowerCase();
					let res;

					const attachment = new MessageAttachment('images/coinflip/animation.gif');

					message.channel.send(attachment).then(msg => msg.delete({ timeout: 3000 }).then(() => {
						if (value == 0) res = 'cara';
						if (value == 1) res = 'coroa';

						message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`, { files: [`images/coinflip/${res}.gif`] });

						if (res != guess) {
							ref.update({
								balance: (bal - money),
							}).then(() => { return message.reply(`perdeste ¤${money}!`); });
						}
						else if (res == guess) {
							const won = money * 2;
							ref.update({
								balance: (bal + won),
							}).then(() => { message.reply(`ganhaste ¤${won}!`); });
						}
					}));
				}
			}
		}).catch(err => { console.error(err); });
	},
};