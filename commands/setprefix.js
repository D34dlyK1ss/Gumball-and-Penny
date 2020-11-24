const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setprefix',
	category: 'Servidor',
	description: 'Muda o nosso prefixo para este servidor',
	usage: 'setprefix [prefixo]',

	execute(bot, message, command, args, db, prefix, prefixes) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 3000 }); }).catch();
		}
		else if (args.length === 0) {
			return message.reply('precisamos de saber qual é o prefixo desejado!').catch();
		}
		else {
			const newPrefix = args[0].toLowerCase(),
				ref = db.collection('servidores').doc(message.guild.id);
			if (newPrefix == config.prefix) {
				prefixes[message.guild.id] = config.prefix;
				ref.update({
					prefix: FieldValue.delete(),
				}).catch(err => { console.error(err); });
			}
			else {
				prefixes[message.guild.id] = newPrefix;
				ref.update({
					prefix: newPrefix,
				}).catch(err => { console.error(err); });
			}
			message.channel.send('O prefixo para este servidor agora é `' + newPrefix + '`').catch();
		}
	},
};
