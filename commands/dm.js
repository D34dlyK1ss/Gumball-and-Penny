module.exports = {
	name: 'dm',
	category: 'Secretos',
	description: 'Enviamos uma mensagem privada ao utilizador mencionado',
	usage: '`+dm [@utilizador] [mensagem]`',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		const mention = getUserFromMention(args[0]);
		args.shift();
		const mentionMessage = args.join(' ');
		message.delete();

		if (!message.member.hasPermission('MANAGE_GUILD')) {
			message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else if (!mention || mention == '') {
			message.reply('não mencionaste ninguém!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else if (!mentionMessage || mentionMessage == '') {
			message.reply('não escreveste nenhuma mensagem!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
		else {
			mention.send(mentionMessage);
			message.reply('enviado!').then(msg => { msg.delete({ timeout: 5000 }); });
		}
	},
};