import { Message } from 'discord.js';
import ms from 'ms';
import getText from '../functions/getText';

export const name = 'daily';
export const aliases = ['d'];
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string, prefix: string) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);
	const daily = 300;

	ref.get().then(doc => {
		const today = Date.now();
		const lastDaily: number = doc.get('lastDaily');
		const nextDaily = lastDaily + 86400000;
		if (!doc.exists) {
			message.reply(getText(lang.error.noProfile, [prefix]));
		}
		else if (today < nextDaily) {
			message.reply(getText(lang.daily.againIn, [ms(nextDaily - today)]));
		}
		else {
			const bal: number = doc.get('balance');

			if (bal + daily > 1000000) {
				message.reply(lang.error.noAdd);
			}
			else {
				ref.update({
					balance: bal + daily,
					lastDaily: today
				}).then(() => {
					message.reply(getText(lang.daily.received, [daily, prefix]));
				});
			}
		}
	});
}
