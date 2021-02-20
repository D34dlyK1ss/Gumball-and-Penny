import { Message } from 'discord.js';
import moment from 'moment';

export const name = 'daily';
export const aliases = ['d'];
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: string, prefix: string) {
	const user = message.author,
		ref = db.collection('perfis').doc(user.id),
		daily = 300;

	ref.get().then((doc: any) => {
		const today = moment().format('L'),
			lastDaily = doc.get('lastDaily');
		if (!doc.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else if (today == lastDaily) {
			moment.locale(`${language}`);
			message.reply(`${lang.daily.againIn + moment().endOf('day').fromNow()}.`).catch(err => { console.error(err); });
		}
		else {
			const bal = doc.get('balance');

			if ((bal + daily) > 1000000) {
				message.reply(lang.error.noAdd).catch(err => { console.error(err); });
			}
			else {
				ref.update({
					balance: (bal + daily),
					lastDaily: today,
				}).then(() => {
					message.reply(`${lang.daily.received}${daily}${lang.daily.toGetMore}\`${prefix}vote\``).catch(err => { console.error(err); });
				}).catch((err: any) => { console.error(err); });
			}
		}
	});
};
