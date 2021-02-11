const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
	name: 'jankenpon',
	aliases: ['jkp'],

	execute(bot, message, command, db, lang, language, prefix, args) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(async doc => {
			const money = Math.floor(parseInt(args[1]));
			if (!doc.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
			}
			else if (!Number.isInteger(money) || (args[0].toLowerCase() != 'gumball' && args[0].toLowerCase() != 'penny')) {
				return message.channel.send(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch(err => { console.error(err); });
			}
			else {
				const bal = doc.get('balance'),
					least = 50,
					most = 1000;

				if ((bal + money) > 1000000) {
					return message.reply(lang.error.noAdd).catch(err => { console.error(err); });
				}
				else if (money > bal) {
					return message.reply(lang.error.noMoney).catch(err => { console.error(err); });
				}
				else if (money < least) {
					return message.reply(`${lang.betAtLeast + least}!`).catch(err => { console.error(err); });
				}
				else if (money > most) {
					return message.reply(`${lang.betAtMost + most}!`).catch(err => { console.error(err); });
				}
				else {
					const g = Math.round(Math.random() * 2),
						p = Math.round(Math.random() * 2),
						guess = args[0].toLowerCase(),
						array = [lang.jankenpon.rock, lang.jankenpon.paper, lang.jankenpon.scissors];
					let resG, resP, finalRes;

					const attachment = new MessageAttachment('img/jankenpon/animation.gif'),
						canvas = createCanvas(400, 200),
						ctx = canvas.getContext('2d');

					const left = await loadImage(`img/jankenpon/gumball (${g}).png`),
						right = await loadImage(`img/jankenpon/penny (${p}).png`);
					ctx.drawImage(left, 0, 0, 200, 200);
					ctx.drawImage(right, 200, 0, 200, 200);

					const attachment2 = new MessageAttachment(canvas.toBuffer(), 'profile.png');

					message.channel.send(attachment).then(msg => msg.delete({ timeout: 2000 }).then(() => {
						if (g === 0 && p === 2) finalRes = 'gumball';
						else if (p === 0 && g === 2) finalRes = 'penny';
						else if (g > p) finalRes = 'gumball';
						else if (p > g) finalRes = 'penny';
						else finalRes = 0;

						resG = array[g];
						resP = array[p];

						if (finalRes === 0) {
							message.channel.send(attachment2).then(() => {
								message.reply(`**Gumball** ${lang.jankenpon.threw} **${resG}** ${lang.and} **Penny** ${lang.jankenpon.threw} **${resP}**! ${lang.jankenpon.draw}`).catch(err => { console.error(err); });
							});
						}
						else if (finalRes === guess) {
							const won = money * 2;
							ref.update({
								balance: (bal + won),
							}).then(async () => {
								await message.channel.send(attachment2);
								return message.reply(`**Gumball** ${lang.jankenpon.threw} **${resG}** ${lang.and} **Penny** ${lang.jankenpon.threw} **${resP}**, ${lang.won}**${won}**!`);
							}).catch(err => { console.error(err); });
						}
						else {
							ref.update({
								balance: (bal - money),
							}).then(async () => {
								await message.channel.send(attachment2);
								return message.reply(`**Gumball** ${lang.jankenpon.threw} **${resG}** ${lang.and} **Penny** ${lang.jankenpon.threw} **${resP}**, ${lang.lost}**${money}**!`);
							}).catch(err => { console.error(err); });
						}
					}));
				}
			}
		});
	},
};