import { Message } from 'discord.js';
import * as botConfig from '../botConfig.json';
import { ServerSettings } from 'index';

export const name = 'setprefix';
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[], serverSettings: ServerSettings) {
	if (!message.member.permissions.has('MANAGE_GUILD')) {
		message.delete();
		message.reply(lang.error.noPerm).then(msg => { { setTimeout(() => { msg.delete(); }, 5000); } }).catch(err => { console.error(err); });
	}
	else if (args[0] === '') {
		message.reply(lang.error.noPrefixChosen).catch(err => { console.error(err); });
	}
	else {
		const newPrefix = args[0].toLowerCase();
		const ref = db.collection('definicoes').doc(message.guild.id);

		ref.get().then((doc: any) => {
			if (!doc.exists) {
				ref.set({
					settings: botConfig.settings
				}, { merge: true }).catch((err: Error) => { console.error(err); });
			}

			const oldPrefix = doc.get('settings').prefix || botConfig.settings.prefix;

			if (newPrefix === oldPrefix) {
				message.reply(lang.error.samePrefix).catch(err => { console.error(err); });
			}
			else {
				serverSettings.prefix = newPrefix;
				ref.set({
					settings: { 'prefix': newPrefix }
				}, { merge: true }).catch((err: Error) => { console.error(err); });
			}
			message.channel.send(`${lang.setprefix.isNow}\`${newPrefix}\``).catch(err => { console.error(err); });
		});
	}
}