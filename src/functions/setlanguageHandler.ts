import { ButtonInteraction } from 'discord.js';
import botConfig from '../../botConfig.json';
import { ServerSettings } from 'index';


export function confirmLanguage(button: ButtonInteraction, db: any, newLanguage: string|undefined , lang:Record<string, any>, prefix: string, serverSettings: ServerSettings) {
	const ref = db.collection('definicoes').doc(button.guild.id);

	if (!button.customId.endsWith(button.user.id)) {
		button.reply({ content: lang.interaction.notAuthor, ephemeral: true });
	}
	if (button.customId.startsWith('languageCancel')) {
		button.update({ content: lang.userCancelled, components:[] });
	}
	else if (newLanguage === undefined) {
		button.reply({ content: lang.setlanguage.noLanguage, ephemeral: true }).catch(err => { console.error(err); });
	}
	else {
		ref.get().then((doc: any) => {
			if (!doc.exists) {
				ref.set({
					settings: botConfig.settings
				}, { merge: true }).catch((err: Error) => { console.error(err); });
			}

			const oldLanguage = doc.get('settings').language || botConfig.settings.language;

			if (newLanguage === oldLanguage) {
				button.reply({ content: lang.error.sameLanguage, ephemeral: true }).catch(err => { console.error(err); });
			}
			else {
				serverSettings.language = newLanguage;
				ref.set({
					settings: { 'language': newLanguage }
				}, { merge: true }).catch((err: Error) => { console.error(err); });
			}
			lang = require(`../../lang/${newLanguage}.json`);
			button.update({ content: lang.setlanguage.isNow, components: [] }).catch(err => { console.error(err); });
		});
	}
}