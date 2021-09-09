import { Message } from 'discord.js';
import ms from 'ms';

export const name = 'daily';
export const aliases = ['d'];
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: string, prefix: string) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);
	const daily = 300;

	ref.get().then((doc: any) => {
		const today = Date.now();
		const lastDaily: number = doc.get('lastDaily');
		const nextDaily = lastDaily + 86400000;
		if (!doc.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else if (today < nextDaily) {
			message.reply(`${lang.daily.againIn}${ms(nextDaily - today)}.`).catch(err => { console.error(err); });
		}
		else {
			const bal: number = doc.get('balance');

			if (bal + daily > 1000000) {
				message.reply(lang.error.noAdd).catch(err => { console.error(err); });
			}
			else {
				ref.update({
					balance: bal + daily,
					lastDaily: today
				}).then(() => {
					message.reply(`${lang.daily.received}**¤${daily}**${lang.daily.toGetMore}\`${prefix}vote\``).catch(err => { console.error(err); });
				}).catch((err: any) => { console.error(err); });
			}
		}
	});
}
