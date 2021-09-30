import { Message } from 'discord.js';
import getText from '../functions/getText';

export const name = 'balance';
export const aliases = ['bal'];
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then(doc => {
		if (!doc.exists) {
			message.reply(getText(lang.error.noProfile, [prefix]));
		}
		else {
			const bal = doc.get('balance');

			message.reply(getText(lang.balance.have, [bal]));
		}
	});
}
