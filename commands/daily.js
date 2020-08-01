function msToTime(duration) {
	let seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? hours : hours;
	minutes = (minutes < 10) ? minutes : minutes;
	seconds = (seconds < 10) ? seconds : seconds;

	switch (hours) {
	case 0:
		hours = '';
		break;
	case 1:
		hours = `${hours} hora, `;
		break;
	default:
		hours = `${hours} horas, `;
		break;
	}

	switch (minutes) {
	case 0:
		minutes = ' e ';
		break;
	case 1:
		minutes = `${minutes} minuto`;
		break;
	default:
		minutes = `${minutes} minutos e `;
		break;
	}

	switch (seconds) {
	case 0:
		seconds = '.';
		break;
	case 1:
		seconds = `${seconds} segundo.`;
		break;
	default:
		seconds = `${seconds} segundos.`;
		break;
	}

	return `${hours, minutes, seconds}`;
}

module.exports = {
	name: 'daily',
	aliases: ['d'],
	category: 'Economia',
	description: 'Receberás ¤250 a cada dia!',
	usage: '`+daily`',

	execute(bot, message, command, args, db) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			const now = new Date();
			const next = new Date();
			next.setDate(next.getDate() + 1);
			next.setHours(0);
			next.setMinutes(0);
			next.setSeconds(0);
			next.setMilliseconds(0);
			const lastdaily = doc.get('lastDaily').toDate();
			const timeLeft = next - now;
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else if (now.getUTCFullYear() == lastdaily.getUTCFullYear() && now.getUTCMonth() == lastdaily.getUTCMonth() && now.getUTCDate() == lastdaily.getUTCDate()) {
				message.channel.send(`Poderás receber o teu montante diário outra vez em ${msToTime(timeLeft)}`);
			}
			else {
				const bal = doc.get('balance');

				db.collection('perfis').doc(user.id).update({
					'balance': (bal + 250),
					'lastDaily': new Date(),
				}).then(() => {
					message.reply('recebeste os teus ¤250 diários!');
				}).catch(err => { console.error(err); });
			}
		}).catch(err => { console.error(err); });
	},
};