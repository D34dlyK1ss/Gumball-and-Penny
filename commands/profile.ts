import { Message, MessageAttachment } from 'discord.js';
import { BotClient } from 'index';
import { registerFont, createCanvas, loadImage } from 'canvas';
import botConfig from '../botConfig.json';
import items from '../src/data/itemlist.json';
import titleCase from '../src/functions/titleCase';
import convert from '../src/functions/convert';
import text from '../src/functions/text';
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export const name = 'profile';
export const aliases = ['p'];
export function execute(bot: BotClient, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	const user = message.mentions.users.first() || message.author;
	const refP = db.collection('perfis').doc(user.id);
	const refI = db.collection('inventario').doc(message.author.id);
	const option = args[0];
	let argsString = args.slice(1).join(' ');

	switch (option) {
		case 'create':
			db.collection('perfis').doc(message.author.id).get().then(doc => {
				if (doc.exists) {
					message.channel.send(lang.error.hasProfileAlready);
				}
				else {
					db.collection('perfis').doc(message.author.id).set({
						balance: 0,
						hud: 'grey',
						description: 'N/A',
						lastDaily: 0,
						level: 0,
						name: user.tag,
						nickname: 'N/A',
						xp: 0
					});
					refI.set({
						huds: ['grey'],
						items: [],
						petHuds: []
					}).then(() => {
						message.reply(text(lang.profile.wasCreated, [prefix, lang.profile.description]));
					});
				}
			});
			break;
		case 'setnickname':
			if (argsString === '') argsString = 'N/A';
			db.collection('perfis').doc(message.author.id).get().then(doc => {
				const nicknameMax = 40;
				if (!doc.exists) {
					if (user === message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else if (argsString.length > nicknameMax) {
					message.reply(text(lang.profile.nicknameMaxIs, [nicknameMax, argsString.length]));
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						nickname: argsString
					}).then(() => {
						message.reply(text(lang.profile.nicknameChangedTo, [argsString]));
					});
				}
			});
			break;
		case 'setdescription':
			db.collection('perfis').doc(message.author.id).get().then(doc => {
				const descMax = 52;
				if (!doc.exists) {
					if (user === message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else if (argsString.length > descMax) {
					message.reply(text(lang.profile.decMaxIs, [descMax, argsString.length]));
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						description: argsString
					}).then(() => {
						message.reply(text(lang.profile.descChangedTo, [argsString]));
					});
				}
			});
			break;
		case 'sethud':
			db.collection('perfis').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user === message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else {
					refI.get().then(docI => {
						const huds = docI.get('huds');
						let newHud = '';

						newHud = newHud.concat(argsString.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud === '') {
							message.reply(lang.error.noHUDChosen);
						}
						else if (!huds.includes(`${newHud}`) && message.author.id !== botConfig.botOwner && !botConfig.collaborators.includes(message.author.id)) {
							message.reply(lang.error.noHaveHUD);
						}
						else {
							db.collection('perfis').doc(message.author.id).update({
								hud: newHud
							}).then(() => {
								message.reply(text(lang.profile.hudChangedTo, [titleCase(argsString)]));
							});
						}
					});
				}
			});
			break;
		default:
			refP.get().then(async doc => {
				if (!doc.exists) {
					if (user === message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
					else if (user === bot.user) {
						message.reply(lang.botNoProfile);
					}
					else if (user.bot) {
						message.reply(lang.botsNoProfile);
					}
					else {
						message.reply(`**${user.tag}**${lang.error.userNoProfile}`);
					}
				}
				else {
					const nick = doc.get('nickname');
					const desc = doc.get('description');
					const bal = doc.get('balance');
					const hud = doc.get('hud');
					const xp = doc.get('xp');

					const level = Math.floor(Math.sqrt(xp / 2000000) * 99) + 1;
					const prevLevel = Math.round(Math.pow((level - 1) / 99, 2) * 2000000);
					const nextLevel = Math.round(Math.pow(level / 99, 2) * 2000000);
					let xpNeeded = nextLevel - prevLevel;
					let xpToNext = xp - prevLevel;

					if (xpNeeded <= 0) xpNeeded = 200;
					if (xpToNext <= 0) xpToNext = xp;

					const canvas = createCanvas(700, 400);
					const ctx = canvas.getContext('2d');

					const bg = await loadImage(`img/profile/hud (${hud}).png`);
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 0.4;
					ctx.fillStyle = 'white';
					ctx.fillRect(175, 192, 465, 30);
					ctx.fill();

					ctx.globalAlpha = 0.7;
					ctx.fillStyle = (items as any).huds[hud].hex;
					ctx.fillRect(175, 192, 99 / xpNeeded * xpToNext * 4.25, 30);
					ctx.fill();
					ctx.globalAlpha = 1;

					ctx.save();
					ctx.font = '20px bold Comic Sans MS';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 0;
					ctx.shadowOffsetX = 1;
					ctx.shadowOffsetY = 1;
					ctx.fillStyle = 'white';
					ctx.textAlign = 'center';
					ctx.fillText(user.tag, 410, 65);

					ctx.font = '16px Comic Sans MS';
					ctx.fillText(`${nick}`, 410, 90);

					ctx.font = '18px Comic Sans MS';
					ctx.textAlign = 'left';
					ctx.fillText(`${lang.totalXP}: ${xp}`, 175, 140);
					ctx.fillText(`${lang.level}: ${level}`, 175, 175);

					ctx.fillStyle = 'gold';
					ctx.textAlign = 'right';
					ctx.fillText(`${lang.balanceProfile}: ¤${bal}`, 640, 155);

					ctx.font = '18px Comic Sans MS';
					ctx.fillStyle = 'white';
					ctx.textAlign = 'left';
					ctx.fillText(`${lang.description}:`, 175, 270);
					ctx.fillText(`${desc}`, 175, 320);

					ctx.font = '18px Comic Sans MS';
					ctx.textAlign = 'center';
					ctx.fillText(`${xpToNext} / ${convert(xpNeeded)}`, 410, 214);
					ctx.restore();

					ctx.closePath();

					const vip = (await db.collection('vip').doc(user.id).get()).data();

					ctx.beginPath();
					ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
					ctx.lineWidth = 6;
					ctx.strokeStyle = 'white';
					ctx.fillStyle = 'white';
					ctx.fill();
					ctx.stroke();
					ctx.closePath();

					if (vip) {
						const crown = await loadImage('./img/profile/crown.png');
						ctx.drawImage(crown, 7, 12, 50, 50);
					}

					const avatar = await loadImage(user.displayAvatarURL({ format: 'png' }));
					ctx.clip();
					ctx.drawImage(avatar, 37, 10, 120, 120);

					const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

					message.channel.send({ files: [attachment] });
				}
			});
			break;
	}
}
