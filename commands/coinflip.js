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
				message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
			}
			else if (!Number.isInteger(money) || (args[0] != 'cara' && args[0] != 'coroa')) {
				message.channel.send(`Sintaxe errada! Como usar: \`${prefix}coinflip [cara/coroa] [quantidade]\``);
			}
			else {
				const bal = doc.get('balance');

				if ((bal + money) > 999999999) {
					message.reply('não podes ganhar mais dinheiro! 😧');
				}
				else if (money > bal) {
					message.reply('não tens dinheiro suficiente!');
				}
				else if (money < 50) {
					message.reply('tens de apostar no mínimo ¤50!');
				}
				else {
					const value = Math.round(Math.random()),
						guess = args[0].toLowerCase();
					let res;

					const attachment = new MessageAttachment('/images/coinflip/animation.gif');

					message.channel.send(attachment).then(msg => msg.delete({ timeout: 2000 }).then(() => {
						if (value == 0) res = 'cara';
						if (value == 1) res = 'coroa';

						message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`, { file: `./images/coinflip/${res}.gif` });

						if (res != guess) {
							db.collection('perfis').doc(user.id).update({
								balance: (bal - money),
							}).then(() => {
								message.reply(`perdeste ¤${money}!`);
							}).catch(err => { console.error(err); });
						}
						else if (res == guess) {
							const won = money * 2;
							db.collection('perfis').doc(user.id).update({
								balance: (bal + won),
							}).then(() => {
								message.reply(`ganhaste ¤${won}!`);
							}).catch(err => { console.error(err); });
						}
					}));
				}
			}
		}).catch(err => { console.error(err); });
	},
};