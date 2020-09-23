const config = require('../config.json');
const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = {
	name: 'setprefix',
	category: 'Server',
	description: 'Change our prefix for this server!',
	usage: 'setprefix [prefix]',

	execute(bot, message, command, args, db, prefix, prefixes) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			return message.reply('you don\'t have permission to use this command! 💢').then(msg => { msg.delete({ timeout: 3000 }); });
		}
		else if (args.length === 0) {
			return message.reply('we need to know which prefix you want!');
		}
		else {
			const newPrefix = args[0],
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
			message.channel.send('Our prefix for this server is now `' + newPrefix + '`');
		}
	},
};
