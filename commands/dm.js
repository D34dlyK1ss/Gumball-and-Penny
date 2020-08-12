module.exports = {
	name: 'dm',
	category: 'Secretos',
	description: 'Enviamos uma mensagem privada ao utilizador mencionado',
	usage: '`+dm [@utilizador] [mensagem]`',

	execute(bot, message, command, args) {
		const mention = message.mentions.users.first();
		args.shift();
		const mentionMessage = args.join(' ');
		message.delete();

		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else if (mention == null || mention == '') {
			message.reply('não mencionaste ninguém!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else if (mentionMessage == null || mentionMessage == '') {
			message.reply('não escreveste nenhuma mensagem!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else {
			mention.send(mentionMessage);
			message.reply('enviado!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
	},
};