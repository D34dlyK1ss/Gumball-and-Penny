import { Message, MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { Cmd } from 'index';
import getText from '../functions/getText';

export const name = 'jankenpon';
export const aliases = ['jkp'];
export function execute(bot: undefined, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then(async doc => {
		const money = Math.floor(parseInt(args[1]));
		if (!doc.exists) {
			message.reply(getText(lang.error.noProfile, [prefix]));
		}
		else if (!Number.isInteger(money) || args[0].toLowerCase() !== 'gumball' && args[0].toLowerCase() !== 'penny') {
			message.channel.send(getText(lang.error.wrongSyntax, [prefix, lang.command[command.name].usage]));
		}
		else {
			const bal: number = doc.get('balance');
			const min = 50;
			const max = 1000;

			if (bal + money > 1000000) {
				message.reply(lang.error.noAdd);
			}
			else if (money > bal) {
				message.reply(lang.error.noMoney);
			}
			else if (money < min) {
				message.reply(getText(lang.betAtLeast, [min]));
			}
			else if (money > max) {
				message.reply(getText(lang.betAtMost, [max]));
			}
			else {
				const gumballRandom = Math.round(Math.random() * 2);
				const pennyRandom = Math.round(Math.random() * 2);
				const guess = args[0].toLowerCase();
				const array = [lang.jankenpon.rock, lang.jankenpon.paper, lang.jankenpon.scissors];
				let finalRes;

				const animation = new MessageAttachment('src/img/jankenpon/animation.gif');
				const canvas = createCanvas(400, 200);
				const ctx = canvas.getContext('2d');

				const gumball = await loadImage(`src/img/jankenpon/gumball (${gumballRandom}).png`);
				const penny = await loadImage(`src/img/jankenpon/penny (${pennyRandom}).png`);
				ctx.drawImage(gumball, 0, 0, 200, 200);
				ctx.drawImage(penny, 200, 0, 200, 200);

				const imageRes = new MessageAttachment(canvas.toBuffer(), 'profile.png');

				message.channel.send({ files: [animation] }).then(msg => {
					setTimeout(() => {
						msg.delete().then(()=> {
							if (gumballRandom === 0 && pennyRandom === 2) finalRes = 'gumball';
							else if (pennyRandom === 0 && gumballRandom === 2) finalRes = 'penny';
							else if (gumballRandom > pennyRandom) finalRes = 'gumball';
							else if (pennyRandom > gumballRandom) finalRes = 'penny';
							else finalRes = 0;

							const gumballRes = array[gumballRandom];
							const pennyRes = array[pennyRandom];
							const messageRes = getText(lang.jankenpon.threw, [gumballRes, pennyRes]);

							if (finalRes === 0) {
								message.reply({ content: `${messageRes} ${lang.jankenpon.draw}`, files: [imageRes] });
							}
							else if (finalRes !== guess) {
								ref.update({
									balance: bal - money
								}).then(() => {
									message.reply({ content: `${messageRes} ${getText(lang.lost, [money])}`, files: [imageRes] });
								});
							}
							else if (finalRes === guess) {
								const won = money * 1.5;

								ref.update({
									balance: bal + won
								}).then(() => {
									message.reply({ content: `${messageRes} ${getText(lang.won, [won])}`, files: [imageRes] });
								});
							}
						});
					}, 2000); });
			}
		}
	});
}