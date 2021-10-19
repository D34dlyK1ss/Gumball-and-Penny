import { Message } from 'discord.js';
import { Cmd } from 'index';
import getText from '../functions/getText';
import titleCase from '../functions/titleCase';

export const name = 'coinflip';
export function execute(bot: undefined, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then(doc => {
		const money = Math.floor(parseInt(args[1]));
		if (!doc.exists) {
			message.reply(getText(lang.error.noProfile, [prefix]));
		}
		else if (!Number.isInteger(money) || args[0] !== lang.coinflip.heads && args[0] !== lang.coinflip.tails) {
			message.channel.send(getText(lang.error.wrongSyntax, [prefix, lang.command[command.name].usage]));
		}
		else {
			const bal: number = doc.get('balance');
			const least = 50;
			const most = 1000;

			if (bal + money > 1000000) {
				message.reply(lang.error.noAdd);
			}
			else if (money > bal) {
				message.reply(lang.error.noMoney);
			}
			else if (money < least) {
				message.reply(getText(lang.betAtLeast, [least]));
			}
			else if (money > most) {
				message.reply(getText(lang.betAtMost, [most]));
			}
			else {
				const value = Math.round(Math.random());
				const guess = args[0].toLowerCase();
				let res: string;

				message.channel.send({ files: ['src/img/coinflip/animation.gif'] }).then(msg => {
					setTimeout(() => {
						value === 0 ? res = 'heads' : res = 'tails';

						const messageRes = titleCase(lang.coinflip[res]);
						const imageRes = `src/img/coinflip/${res}.gif`;

						if (lang.coinflip[res] !== guess) {
							ref.update({
								balance: bal - money
							}).then(() => {
								msg.edit({ content: `${messageRes}! ${getText(lang.lost, [money])}`, files: [imageRes] });
							});
						}
						else if (lang.coinflip[res] === guess) {
							const won = money * 1.5;

							ref.update({
								balance: bal + won
							}).then(() => {
								msg.edit({ content: `${messageRes}! ${getText(lang.won, [won])}`, files: [imageRes] });
							});
						}
					}, 2000);
				});
			}
		}
	});
}