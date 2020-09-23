const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setlanguage',
	category: 'Servidor',
	description: 'Falaremos noutra linguagem!',
	usage: 'setlanguage [pt/en]',

	execute(bot, message, command, args, db, language, languages) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 3000 }); });
		}
		else if (args.length === 0) {
			return message.reply('precisamos de saber qual é a linguagem desejada!');
		}
		else {
			const newLanguage = args[0],
				ref = db.collection('servidores').doc(message.guild.id);
			if (newLanguage == config.language) {
				languages[message.guild.id] = config.prefix;
				ref.update({
					language: FieldValue.delete(),
				}).catch(err => { console.error(err); });
			}
			else {
				languages[message.guild.id] = newLanguage;
				ref.update({
					prefix: newLanguage,
				}).catch(err => { console.error(err); });
			}
			switch (newLanguage) {
			case 'pt':
				message.channel.send('A partir de agora falaremos em Português 🇵:regional_indicator_t:');
				break;
			case 'en':
				message.channel.send('From now on we\'ll speak in English 🇺:regional_indicator_s:');
				break;
			}
		}
	},
};