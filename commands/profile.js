const { MessageAttachment } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
const items = require('../src/data/itemlist.json'),
	titleCase = require('../src/functions/titleCase.js'),
	convert = require('../src/functions/convert.js');
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

module.exports = {
	name: 'profile',
	aliases: ['p'],

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		const user = message.mentions.users.first() || message.author,
			refP = db.collection('perfis').doc(user.id),
			refI = db.collection('inventario').doc(message.author.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'create':
			db.collection('perfis').doc(message.author.id).get().then(async doc => {
				if (doc.exists) {
					return message.channel.send(lang.error.hasProfileAlready).catch();
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
					await refI.set({
						huds: ['grey'],
					}).then(() => {
						message.reply(`${lang.profile.wasCreated}\`${prefix}profile setdescription [${lang.profile.description}]\`!`);
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setnickname':
			if (args == '') args = 'N/A';
			db.collection('perfis').doc(message.author.id).get().then(doc => {
				const nicknameMax = 32;
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else if (args.length > nicknameMax) {
					return message.reply(`${lang.profile.nicknameMaxIs + nicknameMax}!\n${lang.profile.nicknameHas + args.length}.`);
				}
				else {
					const newNickname = titleCase(args);

					db.collection('perfis').doc(message.author.id).update({
						nickname: newNickname,
					}).then(() => {
						message.reply(`${lang.profile.nicknameChangedTo}**${newNickname}**!`);
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setdescription':
			db.collection('perfis').doc(message.author.id).get().then(doc => {
				const descMax = 44;
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else if (args.length > descMax) {
					return message.reply(`${lang.profile.descMaxIs + descMax}!\n${lang.profile.descHas + args.length}.`);
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						description: args,
					}).then(() => {
						message.reply(`${lang.profile.descChangedTo}_**${args}**_`);
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'sethud':
			db.collection('perfis').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user == message.author) {
						return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
					}
				}
				else {
					refI.get().then(docI => {
						const huds = docI.get('huds');
						let newHud = '';

						newHud = newHud.concat(args.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud == '') {
							return message.reply(lang.error.noHUDChosen);
						}
						else if (!huds.includes(`${newHud}`)) {
							return message.reply(lang.error.noHaveHUD);
						}
						else {
							db.collection('perfis').doc(message.author.id).update({
								hud: newHud,
							}).then(() => {
								message.reply(`${lang.profile.hudChangedTo}**${titleCase(args)}**`);
							}).catch(err => { console.error(err); });
						}
					});
				}
			});
			break;
		default:
			refP.get().then(async doc => {
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
					}
					else if (user == bot.user) {
						return message.reply(lang.botNoProfile).catch();
					}
					else if (user.bot) {
						return message.reply(lang.botsNoProfile).catch();
					}
					else {
						return message.reply(`**${user.tag}**${lang.error.userNoProfile}`).catch();
					}
				}
				else {
					const nick = doc.get('nickname'),
						desc = doc.get('description'),
						bal = doc.get('balance'),
						hud = doc.get('hud'),
						xp = doc.get('xp');

					const level = Math.floor(Math.sqrt(xp / 2000000) * 100),
						prevLevel = Math.round(Math.pow(level / 100, 2) * 2000000),
						nextLevel = Math.round(Math.pow((level + 1) / 100, 2) * 2000000);
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
					ctx.fillStyle = items.huds[hud].hex;
					ctx.fillRect(175, 192, ((100 / (xpNeeded)) * (xpToNext) * 4.25), 30);
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
					ctx.stroke();
					ctx.closePath();

					if (vip) {
						const crown = await loadImage('./img/profile/crown.png');
						ctx.drawImage (crown, 7, 12, 50, 50);
					}

					const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
					ctx.clip();
					ctx.drawImage (avatar, 37, 10, 120, 120);


					const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

					message.channel.send(attachment).catch();
				}
			});
			break;
		}
	},
};