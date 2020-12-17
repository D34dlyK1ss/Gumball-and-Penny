module.exports = {
	name: 'clear',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		message.delete().then(() => {
			if (!message.member.hasPermission('MANAGE_MESSAGES')) {
				return message.reply(lang.error.noPerm).catch(err => { console.error(err); });
			}
			else if (!message.channel.guild.me.hasPermission('MANAGE_MESSAGES')) {
				return message.reply(lang.error.botNoManageMsgs).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}
			else if (!args || args == '0') {
				return message.reply(lang.error.noNumberToDelete).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}
			else {
				let number = parseInt(args),
					plural;

				if (!Number.isInteger(number)) {
					return;
				}
				else {
					if (number > 100) number = 100;
					message.channel.bulkDelete(number, true).then(deleted => {
						deleted.size != 1 ? plural = lang.clear.messages : plural = lang.clear.message;
						message.channel.send(`${lang.clear.weDeleted}\`${deleted.size}\`${plural}!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
					});
				}
			}
		});
	},
};