module.exports = {
	name: 'setprefix',
	category: 'Servidor',
	description: 'Muda o nosso prefixo para este servidor',
	usage: 'setprefix [prefixo]',

	execute(bot, message, command, args, db, prefixes) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.delete();
			message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 3000 }); });
		}
		else if (args.length === 0) {
			message.reply('precisamos de saber qual é o prefixo desejado!');
		}
		else {
			const newPrefix = args[0];
			prefixes[message.guild.id] = newPrefix;
			db.collection('servidores').doc(message.guild.id).update({
				prefix: newPrefix,
			}).then(() => {
				message.channel.send('O prefixo para este servidor agora é `' + newPrefix + '`');
			}).catch(err => { console.error(err); });
		}
	},
};
