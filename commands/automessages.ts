import { Message } from 'discord.js';
import * as botConfig from '../botConfig.json';
import { ServerSettings } from 'index';

export const name = 'automessages';
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: undefined, serverSettings: ServerSettings) {
	if (!message.member.permissions.has('MANAGE_GUILD')) {
		message.delete();
		message.reply(lang.error.noPerm).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
	}
	else {
		const ref = db.collection('definicoes').doc(message.guild.id);

		ref.get().then(async (doc: any) => {
			const dbSettings = doc.get('settings') || botConfig.settings;
			const onOff = dbSettings.automessages;
			let toggle = '';
			serverSettings.automessages = !onOff;
			!onOff === true ? toggle = `${lang.enabled}` : toggle = `${lang.disabled}`;

			ref.set({
				settings: serverSettings,
			}, { merge: true }).catch((err: Error) => { console.error(err); });
			message.channel.send(`${lang.automessages.areNow}**${toggle}**`).catch(err => { console.error(err); });
		});
	}
}
