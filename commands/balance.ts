import { Message } from 'discord.js';

export const name = 'balance';
export const aliases = ['bal'];
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: string) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then((doc: any) => {
		if (!doc.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else {
			const bal = doc.get('balance');
			message.reply(`${lang.balance.have}**¤${bal}**.`).catch(err => { console.error(err); });
		}
	});
}
