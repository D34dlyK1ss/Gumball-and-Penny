module.exports = {
	name: 'clear',
	category: 'Moderação',
	description: 'Limpa o chat',
	usage: 'clear [número]',

	execute(bot, message, command, args) {
		message.delete().then(() => {
			if (!message.member.hasPermission('MANAGE_MESSAGES')) {
				return message.reply('não tens permissão para usar este comando! 💢').then(msg => { msg.delete({ timeout: 5000 }); });
			}
			else if (!message.channel.guild.me.hasPermission('MANAGE_MESSAGES')) {
				return message.reply('nós não temos permissão para gerir mensagens!');
			}
			else if (args == '' || args == '0') {
				return message.reply('tens de definir o número de mensagens que queres apagar!').then(msg => msg.delete({ timeout: 5000 }));
			}
			else {
				let number = parseInt(args),
					plural = 'm';

				if (!Number.isInteger(number)) {
					return;
				}
				else {
					if (number > 100) {
						number = 100;
					}
					message.channel.bulkDelete(number, true).then(deleted => {
						if (deleted.size != 1) plural = 'ns';
						message.channel.send(`Apagámos \`${deleted.size}\` mensage${plural}!`).then(msg => msg.delete({ timeout: 5000 }));
					});
				}
			}
		});
	},
};