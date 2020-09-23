module.exports = {
	name: 'clear',
	category: 'Moderation',
	description: 'We\'ll clear the chat for you!',
	usage: 'clear [number]',

	execute(bot, message, command, args) {
		message.delete().then(() => {
			if (!message.member.hasPermission('MANAGE_MESSAGES')) {
				return message.reply('you don\'t have permission to use this command! 💢').then(msg => { msg.delete({ timeout: 5000 }); });
			}
			else if (!message.channel.guild.me.hasPermission('MANAGE_MESSAGES')) {
				return message.reply('we don\'t have permission to manage messages!');
			}
			else if (args == '' || args == '0') {
				return message.reply('you have to define how many messages you want to delete!').then(msg => msg.delete({ timeout: 5000 }));
			}
			else {
				let number = parseInt(args),
					plural = '';

				if (!Number.isInteger(number)) {
					return;
				}
				else {
					if (number > 100) {
						number = 100;
					}
					message.channel.bulkDelete(number, true).then(deleted => {
						if (deleted.size > 1) plural = 's';
						message.channel.send(`We've cleared \`${deleted.size}\` message${plural}!`).then(msg => msg.delete({ timeout: 5000 }));
					});
				}
			}
		});
	},
};