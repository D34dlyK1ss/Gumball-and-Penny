import { Message, TextChannel } from 'discord.js';

export const name = 'clear';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete().then(() => {
		let number = parseInt(args[0]);

		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			message.reply(lang.error.noPerm).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
			message.reply(lang.error.botNoManageMsgs).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!args[0] || args[0] == '0' || !Number.isInteger(number)) {
			message.reply(lang.error.noNumberToDelete).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			let plural;

			if (number > 100) number = 100;

			(message.channel as TextChannel).bulkDelete(number, true).then(deleted => {
				deleted.size === 1 ? plural = lang.clear.message : plural = lang.clear.messages;
				message.channel.send(`${lang.clear.weDeleted}\`${deleted.size}\`${plural}!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			});
		}
	});
};