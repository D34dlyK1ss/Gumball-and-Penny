import { Message, MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { Cmd } from 'index';

export const name = 'jankenpon';
export const aliases = ['jkp'];
export function execute(bot: undefined, message: Message, command: Cmd, db: any, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then(async (doc: any) => {
		const money = Math.floor(parseInt(args[1]));
		if (!doc.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else if (!Number.isInteger(money) || args[0].toLowerCase() !== 'gumball' && args[0].toLowerCase() !== 'penny') {
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
				const g = Math.round(Math.random() * 2);
				const p = Math.round(Math.random() * 2);
				const guess = args[0].toLowerCase();
				const array = [lang.jankenpon.rock, lang.jankenpon.paper, lang.jankenpon.scissors];
				let resG: string;
				let resP: string;
				let finalRes;

				const attachment = new MessageAttachment('img/jankenpon/animation.gif');
				const canvas = createCanvas(400, 200);
				const ctx = canvas.getContext('2d');

				const left = await loadImage(`img/jankenpon/gumball (${g}).png`);
				const right = await loadImage(`img/jankenpon/penny (${p}).png`);
				ctx.drawImage(left, 0, 0, 200, 200);
				ctx.drawImage(right, 200, 0, 200, 200);

				const attachment2 = new MessageAttachment(canvas.toBuffer(), 'profile.png');

				message.channel.send({ files: [attachment] }).then(msg => { setTimeout(() => {
					msg.delete().then(()=> {
						if (g === 0 && p === 2) finalRes = 'gumball';
						else if (p === 0 && g === 2) finalRes = 'penny';
						else if (g > p) finalRes = 'gumball';
						else if (p > g) finalRes = 'penny';
						else finalRes = 0;

						resG = array[g];
						resP = array[p];

						if (finalRes === 0) {
							message.channel.send({ files: [attachment2] }).then(() => {
								message.reply(`**Gumball** ${lang.jankenpon.threw} **${resG}** ${lang.and} **Penny** ${lang.jankenpon.threw} **${resP}**! ${lang.jankenpon.draw}`).catch(err => { console.error(err); });
							});
						}
						else if (finalRes === guess) {
							const won = money * 1.5;
							ref.update({
								balance: bal + won
							}).then(async () => {
								await message.channel.send({ files: [attachment2] });
								message.reply(`**Gumball** ${lang.jankenpon.threw} **${resG}** ${lang.and} **Penny** ${lang.jankenpon.threw} **${resP}**, ${lang.won} **¤${won}**!`);
							}).catch((err: Error) => { console.error(err); });
						}
						else {
							ref.update({
								balance: bal - money
							}).then(async () => {
								await message.channel.send({ files: [attachment2] });
								message.reply(`**Gumball** ${lang.jankenpon.threw} **${resG}** ${lang.and} **Penny** ${lang.jankenpon.threw} **${resP}**, ${lang.lost} **¤${money}**!`);
							}).catch((err: Error) => { console.error(err); });
						}
					});
				}, 3000); });
			}
		}
	});
}