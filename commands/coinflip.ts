import { Message, MessageAttachment } from 'discord.js';
import { Cmd } from 'index';

export const name = 'coinflip';
export function execute(bot: undefined, message: Message, command: Cmd, db: any, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const user = message.author,
		ref = db.collection('perfis').doc(user.id);

	ref.get().then(async (doc: any) => {
		const money = Math.floor(parseInt(args[1]));
		if (!doc.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else if (!Number.isInteger(money) || (args[0] != lang.coinflip.heads && args[0] != lang.coinflip.tails)) {
			message.channel.send(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch(err => { console.error(err); });
		}
		else {
			const bal = doc.get('balance'),
				least = 50,
				most = 1000;

			if ((bal + money) > 1000000) {
				message.reply(lang.error.noAdd).catch(err => { console.error(err); });
			}
			else if (money > bal) {
				message.reply(lang.error.noMoney).catch(err => { console.error(err); });
			}
			else if (money < least) {
				message.reply(`${lang.betAtLeast + least}!`).catch(err => { console.error(err); });
			}
			else if (money > most) {
				message.reply(`${lang.betAtMost + most}!`).catch(err => { console.error(err); });
			}
			else {
				const value = Math.round(Math.random()),
					guess = args[0].toLowerCase();
				let res: string;

				const attachment = new MessageAttachment('img/coinflip/animation.gif');

				message.channel.send(attachment).then(msg => msg.delete({ timeout: 2500 }).then(() => {
					if (value == 0) res = lang.coinflip.heads;
					else if (value == 1) res = lang.coinflip.tails;

					message.channel.send(`${res.charAt(0).toUpperCase() + res.slice(1)}!`, { files: [`img/coinflip/${lang.coinflip[res]}.gif`] });

					if (res != guess) {
						ref.update({
							balance: (bal - money),
						}).then(() => { message.reply(`${lang.lost + money}!`); }).catch((err: any) => { console.error(err); });
					}
					else if (res == guess) {
						const won = money * 2;
						ref.update({
							balance: (bal + won),
						}).then(() => { message.reply(`${lang.won + won}!`); }).catch((err: any) => { console.error(err); });
					}
				}));
			}
		}
	});
};