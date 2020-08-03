module.exports = {
	name: 'coinflip',
	category: 'Casino',
	description: 'Roda a moeda e aposta no que vai calhar!',
	usage: '`+coinflip [cara/coroa] [quantidade]`',

	execute(bot, message, command, args, db) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (args == null || args[1] == '' || (args[0] != 'cara' && args[0] != 'coroa')) {
				message.channel.send('Sintaxe errada! Como usar: `+coinflip [cara/coroa] [quantidade]`');
			}
			else {
				const bal = doc.get('balance'),
					money = args[1];

				if ((bal + money) > 999999999) {
					message.reply('não podes ganhar mais dinheiro! 😧');
				}
				else if (money > bal) {
					message.reply('Não tens dinheiro suficiente!');
				}
				else if (money < 50) {
					message.reply('Tens de apostar no mínimo ¤50!');
				}
				else {
					const value = Math.round(Math.random()),
						guess = args[0].toLowerCase();
					let res;

					if (value == 0) res = 'cara';
					if (value == 1) res = 'coroa';

					message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`);

					if (res != guess) {
						db.collection('perfis').doc(user.id).update({
							balance: (bal - money),
						}).then(() => {
							message.channel.send(`Perdeste ¤${money}!`);
						}).catch(err => { console.error(err); });
					}
					else if (res == guess) {
						const won = money * 2;
						db.collection('perfis').doc(user.id).update({
							balance: (bal + won),
						}).then(() => {
							message.channel.send(`Ganhaste ¤${won + 50}!`);
						}).catch(err => { console.error(err); });
					}
				}
			}
		}).catch(err => { console.error(err); });
	},
};