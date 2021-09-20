import { Message, TextChannel } from 'discord.js';

export const name = 'clear';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete().then(() => {
		let integer = parseInt(args[0], 10);

		if (!message.member.permissions.has('MANAGE_MESSAGES')) {
			message.reply(lang.error.noPerm).catch(err => { console.error(err); });
		}
		else if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
			message.reply(lang.error.botNoManageMsgs).catch(err => { console.error(err); });
		}
		else if (!args[0] || args[0] === '0' || !Number.isInteger(integer)) {
			message.reply(lang.error.noNumberToDelete).catch(err => { console.error(err); });
		}
		else {
			let plural;

			if (integer > 100) integer = 100;

			(message.channel as TextChannel).bulkDelete(integer, true).then(deleted => {
				deleted.size === 1 ? plural = lang.clear.message : plural = lang.clear.messages;
				message.channel.send(`${lang.clear.weDeleted}\`${deleted.size}\`${plural}!`).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
			});
		}
	});
}