const { MessageAttachment } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
const items = require('../itemlist.json');
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

function convert(value) {
	if (value >= 1000000) {
		value = (value / 1000000) + 'M';
	}
	else if (value >= 1000) {
		value = (value / 1000) + 'k';
	}
	return value;
}

module.exports = {
	name: 'profile',
	aliases: ['p'],
	category: 'Economia e Perfil',
	description: 'Vê o teu perfil ou o de alguém!\nOpções disponíveis: `create`, `sethud`, `setnickname`, `setdescription`',
	usage: 'profile [opcional - opção | @membro]',

	execute(bot, message, command, args, db, prefix) {
		const user = message.mentions.users.first() || message.author,
			refP = db.collection('perfis').doc(user.id),
			refI = db.collection('inventario').doc(message.author.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'create':
			refP.get().then(doc => {
				if (doc.exists) {
					if (user == message.author) {
						return message.channel.send('Já tens um perfil criado, não podes criar outro! 💢');
					}
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
					}).then(() => {
						refI.set({
							huds: ['grey'],
						}).then(() => {
							message.reply(`o teu perfil foi criado! Adiciona uma descricão com \`${prefix}profile setdescription [descrição]\`!`);
						});
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setnickname':
			if (args == '') args = 'N/A';
			refP.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
				}
				else if (args.length > 32) {
					return message.reply(`o limite máximo de caracteres para a alcunha é de 32!\nEssa alcunha tem ${args.length}.`);
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						nickname: args,
					}).then(() => {
						message.reply('a tua alcunha foi alterada!');
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setdescription':
			refP.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
				}
				else if (args.length > 44) {
					return message.reply(`o limite máximo de caracteres para a descrição é de 44!\nEssa descrição tem ${args.length}.`);
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						description: args,
					}).then(() => {
						message.reply('a tua descrição foi alterada!');
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'sethud':
			refP.get().then(docP => {
				if (!docP.exists) {
					if (user == message.author) {
						return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
				}
				else {
					refI.get().then(docI => {
						const huds = docI.get('huds');
						let newHud = '';

						newHud = newHud.concat(args.slice(0)).toLowerCase().replace(/[,]/g, '_');

						if (!newHud || newHud == '') {
							return message.reply('não escolheste um HUD!');
						}
						else if (!huds.includes(`${newHud}`)) {
							return message.reply('não tens esse HUD!');
						}
						else {
							db.collection('perfis').doc(message.author.id).update({
								hud: newHud,
							}).then(() => {
								message.reply(`alteraste o teu HUD para **${newHud.charAt(0).toUpperCase() + newHud.slice(1)}**`);
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
						return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
					else if (user == bot.user) {
						return message.reply('nós não precisamos de ter um perfil!');
					}
					else if (user.bot) {
						return message.reply('os bots não criam perfis! 😂 ');
					}
					else {
						return message.reply(`${user.tag} ainda não criou um perfil!`);
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

					const bg = await loadImage(`images/profile/hud (${hud}).png`);
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
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.fillStyle = 'white';
					ctx.textAlign = 'center';
					ctx.fillText(`${user.tag}`, 410, 65);

					ctx.font = '16px Comic Sans MS';
					ctx.fillText(`${nick}`, 410, 90);

					ctx.font = '18px Comic Sans MS';
					ctx.textAlign = 'left';
					ctx.fillText(`XP Total: ${xp}`, 175, 140);
					ctx.fillText(`Nível: ${level}`, 175, 175);

					ctx.fillStyle = 'gold';
					ctx.textAlign = 'right';
					ctx.fillText(`Capital: ¤${bal}`, 640, 155);

					ctx.font = '18px Comic Sans MS';
					ctx.fillStyle = 'white';
					ctx.textAlign = 'left';
					ctx.fillText('Descrição:', 175, 270);
					ctx.fillText(`${desc}`, 175, 320);

					ctx.font = '18px Comic Sans MS';
					ctx.textAlign = 'center';
					ctx.fillText(`${xpToNext} / ${convert(xpNeeded)}`, 410, 214);
					ctx.restore();

					ctx.closePath();

					ctx.beginPath();
					ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
					ctx.lineWidth = 6;
					ctx.strokeStyle = 'white';
					ctx.stroke();
					ctx.closePath();

					const vip = (await db.collection('vip').doc(user.id).get()).data().vip;

					if (vip == true) {
						const crown = await loadImage('./images/profile/crown.png');
						ctx.drawImage (crown, 7, 12, 50, 50);
					}

					const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
					ctx.clip();
					ctx.drawImage (avatar, 37, 10, 120, 120);


					const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

					message.channel.send(attachment);
				}
			});
			break;
		}
	},
};