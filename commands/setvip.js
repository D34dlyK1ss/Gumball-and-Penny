const config = require('../config.json');

module.exports = {
	name: 'setvip',

	execute(bot, message, command, db, lang, language, prefix, args) {
		if(message.author.id !== config.botOwner || message.channel.id !== '809182965607039007') return;

		if (!args) return message.channel.send('Não forneceste ID nenhum!').catch(err => { console.error(err); });

		const filter = m => m.author.id == message.author.id && Number.isInteger(parseInt(m.content)) && parseInt(m.content) > 0;
		message.channel.send('Por quantos meses?');
		message.channel.awaitMessages(filter, { max: 1, time: 5000, errors: ['time'] }).then(collected => {
			const number = parseInt(collected.first().content);
			const timestamp = new Date(Date.now() + (number * 2592000000));
			args.forEach(id => {
				db.collection('vip').doc(id).set({
					until: timestamp,
				});
			});

			let plural, pluralM;

			number === 1 ? pluralM = 'mês' : pluralM = 'meses';
			args.length === 1 ? plural = ' é' : plural = 'es são';
			return message.channel.send(`${args.length} utilizador${plural} agora VIP por ${number} ${pluralM}!`).catch(err => { console.error(err); });
		}).catch(() => message.reply('não indicaste o número de meses! Abortando...'));
	},
};