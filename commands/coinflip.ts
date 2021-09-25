import { Message } from 'discord.js';
import { Cmd } from 'index';
import titleCase from '../src/functions/titleCase';

export const name = 'coinflip';
export function execute(bot: undefined, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then(doc => {
		const money = Math.floor(parseInt(args[1]));
		if (!doc.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else if (!Number.isInteger(money) || args[0] !== lang.coinflip.heads && args[0] !== lang.coinflip.tails) {
			message.channel.send(`${lang.error.wrongSyntax}\`${prefix}${lang.command[command.name].usage}\``).catch(err => { console.error(err); });
		}
		else {
			const bal: number = doc.get('balance');
			const least = 50;
			const most = 1000;

			if (bal + money > 1000000) {
				message.reply(lang.error.noAdd).catch(err => { console.error(err); });
			}
			else if (money > bal) {
				message.reply(lang.error.noMoney).catch(err => { console.error(err); });
			}
			else if (money < least) {
				message.reply(`${lang.betAtLeast}${least}!`).catch(err => { console.error(err); });
			}
			else if (money > most) {
				message.reply(`${lang.betAtMost}${most}!`).catch(err => { console.error(err); });
			}
			else {
				const value = Math.round(Math.random());
				const guess = args[0].toLowerCase();
				let res: string;

				message.channel.send({ files: ['img/coinflip/animation.gif'] }).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).then(() => {
					value === 0 ? res = 'heads' : res = 'tails';

					message.channel.send({ content: `${titleCase(lang.coinflip[res])}!`, files: [`img/coinflip/${res}.gif`] });

					if (res !== guess) {
						ref.update({
							balance: bal - money
						}).then(() => { message.reply(`${lang.lost} **¤${money}**!`); }).catch((err: Error) => { console.error(err); });
					}
					else if (res === guess) {
						const won = money * 1.5;
						ref.update({
							balance: bal + won
						}).then(() => { message.reply(`${lang.won} **¤${won}**!`); }).catch((err: Error) => { console.error(err); });
					}
				});
			}
		}
	});
}