import { Message } from 'discord.js';
import * as botConfig from '../botConfig.json';
import { serverSettings } from 'index';

export const name = 'automessages';
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: undefined, serverSettings: serverSettings) {
	if (!message.member.hasPermission('MANAGE_GUILD')) {
		message.delete();
		message.reply(lang.error.noPerm).then(msg => { msg.delete({ timeout: 3000 }); }).catch(err => { console.error(err); });
	}
	else {
		const ref = db.collection('definicoes').doc(message.guild.id);

		ref.get().then(async (doc: any) => {
			const dbSettings = doc.get('settings') || botConfig.settings;
			const boolean = dbSettings.automessages;
			let toggle = '';
			serverSettings.automessages = !boolean;
			!boolean === true ? toggle = `${lang.enabled}` : toggle = `${lang.disabled}`;

			ref.set({
				settings: serverSettings,
			}, { merge: true }).catch((err: Error) => { console.error(err); });
			message.channel.send(`${lang.automessages.areNow}**${toggle}**`).catch(err => { console.error(err); });
		});
	}
};