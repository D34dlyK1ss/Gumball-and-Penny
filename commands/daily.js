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
		if (minutes == 0 && seconds == 0) hours = '1 hora';
		else hours = '1 hora, ';
		break;
	default:
		if (minutes == 0 && seconds == 0) hours = `${hours} horas`;
		else hours = `${hours} horas,`;
		break;
	}

	switch (minutes) {
	case 0:
		minutes = '';
		break;
	case 1:
		if (hours != 0 && seconds == 0) minutes = ' e 1 minuto';
		else minutes = ' 1 minuto';
		break;
	default:
		if (hours != 0 && seconds == 0) minutes = ` e ${minutes} minutos`;
		else minutes = ` ${minutes} minutos`;
		break;
	}

	switch (seconds) {
	case 0:
		seconds = '.';
		break;
	case 1:
		if (hours == 0 && minutes == 0) seconds = '1 segundo.';
		else seconds = ' e 1 segundo.';
		break;
	default:
		if (hours == 0 && minutes == 0) seconds = ` ${seconds} segundos.`;
		else seconds = ` e ${seconds} segundos.`;
		break;
	}

	return `${hours}${minutes}${seconds}`;
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
			next.setDate(next.getUTCDate() + 1);
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
					'lastDaily': now,
				}).then(() => {
					message.reply('recebeste os teus ¤250 diários!');
				}).catch(err => { console.error(err); });
			}
		}).catch(err => { console.error(err); });
	},
};
