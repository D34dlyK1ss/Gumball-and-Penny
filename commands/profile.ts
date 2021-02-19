import { Client, Message, MessageAttachment } from 'discord.js';
import { registerFont, createCanvas, loadImage } from 'canvas';
import items from '../src/data/itemlist.json';
import titleCase from '../src/functions/titleCase';
import convert from '../src/functions/convert';
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export const name = 'profile';
export const aliases = ['p'];
export function execute(bot: Client, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	const user = message.mentions.users.first() || message.author,
		refP = db.collection('perfis').doc(user.id),
		refI = db.collection('inventario').doc(message.author.id),
		option = args[0];
	let argsString = args.slice(1).join(' ');

	switch (option) {
		case 'create':
			db.collection('perfis').doc(message.author.id).get().then((doc: any) => {
				if (doc.exists) {
					message.channel.send(lang.error.hasProfileAlready).catch(err => { console.error(err); });
				}
				else {
					db.collection('perfis').doc(message.author.id).set({
						balance: 0,
						hud: 'grey',
						description: 'N/A',
						lastDaily: '01/01/1970',
						level: 0,
						name: user.tag,
						nickname: 'N/A',
						xp: 0,
					});
					refI.set({
						huds: ['grey'],
					}).then(() => {
						message.reply(`${lang.profile.wasCreated}\`${prefix}profile setdescription [${lang.profile.description}]\`!`);
					}).catch((err: Error) => { console.error(err); });
				}
			});
			break;
		case 'setnickname':
			if (argsString == '') argsString = 'N/A';
			db.collection('perfis').doc(message.author.id).get().then((doc: any) => {
				const nicknameMax = 32;
				if (!doc.exists) {
					if (user == message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else if (argsString.length > nicknameMax) {
					message.reply(`${lang.profile.nicknameMaxIs + nicknameMax}!\n${lang.profile.nicknameHas + argsString.length}.`);
				}
				else {
					const newNickname = titleCase(argsString);

					db.collection('perfis').doc(message.author.id).update({
						nickname: newNickname,
					}).then(() => {
						message.reply(`${lang.profile.nicknameChangedTo}**${newNickname}**!`);
					}).catch((err: Error) => { console.error(err); });
				}
			});
			break;
		case 'setdescription':
			db.collection('perfis').doc(message.author.id).get().then((doc: any) => {
				const descMax = 44;
				if (!doc.exists) {
					if (user == message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else if (argsString.length > descMax) {
					message.reply(`${lang.profile.descMaxIs + descMax}!\n${lang.profile.descHas + argsString.length}.`);
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						description: argsString,
					}).then(() => {
						message.reply(`${lang.profile.descChangedTo}_**${argsString}**_`);
					}).catch((err: Error) => { console.error(err); });
				}
			});
			break;
		case 'sethud':
			db.collection('perfis').doc(message.author.id).get().then((docP: any) => {
				if (!docP.exists) {
					if (user == message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else {
					refI.get().then((docI: any) => {
						const huds = docI.get('huds');
						let newHud = '';

						newHud = newHud.concat(argsString.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud == '') {
							message.reply(lang.error.noHUDChosen);
						}
						else if (!huds.includes(`${newHud}`)) {
							message.reply(lang.error.noHaveHUD);
						}
						else {
							db.collection('perfis').doc(message.author.id).update({
								hud: newHud,
							}).then(() => {
								message.reply(`${lang.profile.hudChangedTo}**${titleCase(argsString)}**`);
							}).catch((err: Error) => { console.error(err); });
						}
					});
				}
			});
			break;
		default:
			refP.get().then(async (doc: any) => {
				if (!doc.exists) {
					if (user == message.author) {
						message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
					}
					else if (user == bot.user) {
						message.reply(lang.botNoProfile).catch(err => { console.error(err); });
					}
					else if (user.bot) {
						message.reply(lang.botsNoProfile).catch(err => { console.error(err); });
					}
					else {
						message.reply(`**${user.tag}**${lang.error.userNoProfile}`).catch(err => { console.error(err); });
					}
				}
				else {
					const nick = doc.get('nickname'),
						desc = doc.get('description'),
						bal = doc.get('balance'),
						hud = doc.get('hud'),
						xp = doc.get('xp');

					const level = Math.floor(Math.sqrt(xp / 2000000) * 99) + 1,
						prevLevel = Math.round(Math.pow((level - 1) / 99, 2) * 2000000),
						nextLevel = Math.round(Math.pow(level / 99, 2) * 2000000);
					let xpNeeded = nextLevel - prevLevel,
						xpToNext = xp - prevLevel;

					if (xpNeeded <= 0) xpNeeded = 200;
					if (xpToNext <= 0) xpToNext = xp;

					const canvas = createCanvas(700, 400),
						ctx = canvas.getContext('2d');

					const bg = await loadImage(`img/profile/hud (${hud}).png`);
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 0.4;
					ctx.fillStyle = 'white';
					ctx.fillRect(175, 192, 465, 30);
					ctx.fill();

					ctx.globalAlpha = 0.7;
					ctx.fillStyle = (items as any).huds[hud].hex;
					ctx.fillRect(175, 192, ((99 / (xpNeeded)) * (xpToNext) * 4.25), 30);
					ctx.fill();
					ctx.globalAlpha = 1;

					ctx.save();
					ctx.font = '20px bold Comic Sans MS';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 3;
					ctx.shadowOffsetX = 3;
					ctx.shadowOffsetY = 3;
					ctx.fillStyle = 'white';
					ctx.textAlign = 'center';
					ctx.fillText(`${user.tag}`, 410, 65);

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

					message.channel.send(attachment).catch(err => { console.error(err); });
				}
			});
			break;
	}
};