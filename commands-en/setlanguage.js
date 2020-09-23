const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setlanguage',
	category: 'Server',
	description: 'We\'ll talk in another language!',
	usage: 'setlanguage [pt/en]',

	execute(bot, message, command, args, db, language, languages) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply('you don\'t have permission to use this command! 💢').then(msg => { msg.delete({ timeout: 3000 }); });
		}
		else if (args.length === 0) {
			return message.reply('we need to know which language you want!');
		}
		else {
			const newLanguage = args[0],
				ref = db.collection('servidores').doc(message.guild.id);
			if (newLanguage == config.language) {
				languages[message.guild.id] = config.language;
				ref.update({
					language: FieldValue.delete(),
				}).catch(err => { console.error(err); });
			}
			else {
				languages[message.guild.id] = newLanguage;
				ref.update({
					language: newLanguage,
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