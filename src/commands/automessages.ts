import { Message } from 'discord.js';
import botConfig from '../../botConfig.json';
import { ServerSettings } from 'index';
import getText from '../functions/getText';

export const name = 'automessages';
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: undefined, serverSettings: ServerSettings) {
	if (!message.member?.permissions.has('MANAGE_GUILD')) {
		message.delete();
		message.reply(lang.error.noPerm);
	}
	else {
		const ref = db.collection('definicoes').doc(message.guildId as string);

		ref.get().then(async doc => {
			const dbSettings = await doc.get('settings') || botConfig.settings;
			const onOff = dbSettings.automessages;
			let toggle = '';

			serverSettings.automessages = !onOff;
			!onOff === true ? toggle = lang.enabled : toggle = lang.disabled;

			ref.set({
				settings: serverSettings
			}, { merge: true });

			message.channel.send(getText(lang.automessages.areNow, [toggle]));
		});
	}
}
