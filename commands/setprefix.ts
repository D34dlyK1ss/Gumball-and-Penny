import { Message } from 'discord.js';
import * as botConfig from '../botConfig.json';
import { ServerSettings } from 'index';
import getText from '../src/functions/getText';

export const name = 'setprefix';
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[], serverSettings: ServerSettings) {
	if (!message.member.permissions.has('MANAGE_GUILD')) {
		message.delete();
		message.reply(lang.error.noPerm);
	}
	else if (args[0] === '') {
		message.reply(lang.error.noPrefixChosen);
	}
	else {
		const newPrefix = args[0].toLowerCase();
		const ref = db.collection('definicoes').doc(message.guild.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				ref.set({
					settings: botConfig.settings
				}, { merge: true });
			}

			const oldPrefix = doc.get('settings').prefix || botConfig.settings.prefix;

			if (newPrefix === oldPrefix) {
				message.reply(lang.error.samePrefix);
			}
			else {
				serverSettings.prefix = newPrefix;
				ref.set({
					settings: { 'prefix': newPrefix }
				}, { merge: true });
			}
			message.channel.send(getText(lang.setprefix.isNow, [newPrefix]));
		});
	}
}