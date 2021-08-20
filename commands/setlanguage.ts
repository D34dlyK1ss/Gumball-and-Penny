import { Message } from 'discord.js';
import * as botConfig from '../botConfig.json';
import { ServerSettings } from 'index';

export const name = 'setlanguage';
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[], serverSettings: ServerSettings) {
	if (!message.member.permissions.has('MANAGE_GUILD')) {
		message.delete();
		message.reply(lang.error.noPerm).then(msg => { { setTimeout(() => { msg.delete(); }, 5000); } }).catch(err => { console.error(err); });
	}
	else {
		const availableLangs = ['pt', 'en'];
		const newLanguage = args[0].toLowerCase();
		const ref = db.collection('definicoes').doc(message.guild.id);

		if (!availableLangs.includes(newLanguage)) {
			message.reply(`${lang.setlanguage.noLanguage}\`${prefix}help setlanguage\`${lang.forMoreInfo}`).catch(err => { console.error(err); });
		}
		else {
			ref.get().then((doc: any) => {
				if (!doc.exists) {
					ref.set({
						settings: botConfig.settings,
					}, { merge: true }).catch((err: Error) => { console.error(err); });
				}

				const oldLanguage = doc.get('settings').language || botConfig.settings.language;

				if (newLanguage === oldLanguage) {
					message.reply(lang.error.sameLanguage).catch(err => { console.error(err); });
				}
				else {
					serverSettings.language = newLanguage;
					ref.set({
						settings: { 'language': newLanguage },
					}, { merge: true }).catch((err: Error) => { console.error(err); });
				}
				lang = require(`../lang/${newLanguage}.json`);
				message.channel.send(`${lang.setlanguage.isNow}`).catch(err => { console.error(err); });
			});
		}
	}
}
