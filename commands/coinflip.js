module.exports = {
	name: 'coinflip',
	category: 'Casino',
	description: 'Roda a moeda e aposta no que vai calhar!',
	usage: '`+coinflip [quantidade] [cara/coroa]`',

	execute(bot, message, command, args, db) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (args == null || args[0] == '' || (args[1] != 'cara' && args[1] != 'coroa')) {
				message.channel.send('Sintaxe errada! Como usar: `+coinflip [quantidade] [cara/coroa]`');
			}
			else {
				const bal = doc.get('balance'),
					money = args[0];
				if (money > bal) {
					message.reply('Não tens dinheiro suficiente!');
				}
				else if (money < 50) {
					message.reply('Tens de apostar no mínimo ¤50!');
				}
				else {
					const value = Math.round(Math.random()),
						guess = args[1].toLowerCase();
					let res = 0;

					if (value == 0) res = 'cara';
					if (value == 1) res = 'coroa';

					message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`);

					if (res != guess) {
						db.collection('perfis').doc(user.id).update({
							'balance': (bal - money),
						}).then(() => {
							message.channel.send(`Perdeste ¤${money}!`);
						}).catch(err => { console.error(err); });
					}
					else if (res == guess) {
						const won = money * 2;
						db.collection('perfis').doc(user.id).update({
							'balance': (bal - money + won),
						}).then(() => {
							message.channel.send(`Ganhaste ¤${won}!`);
						}).catch(err => { console.error(err); });
					}
				}
			}
		}).catch(err => { console.error(err); });
	},
};