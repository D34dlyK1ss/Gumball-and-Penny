module.exports = {
	name: 'dm',
	category: 'Secretos',
	description: 'Enviamos uma mensagem privada ao utilizador mencionado',
	usage: '`+dm [@utilizador] [mensagem]`',

	execute(bot, message, command, args) {
		const mention = message.mentions.users.first();
		message.delete();
		if (mention == null || mention == '') {
			message.reply('não mencionaste ninguém!').then(msg => { msg.delete({ timeout: 5000 }); }).catch(err => { console.error(err); });
			return;
		}
		else if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 5000 }); }).catch(err => { console.error(err); });
		}
		else {
			const mentionMessage = message.content.slice(args[0].length + 4);
			mention.send(mentionMessage);
			message.reply('enviado!').then(msg => { msg.delete({ timeout: 5000 }); }).catch(err => { console.error(err); });
		}
	},
};