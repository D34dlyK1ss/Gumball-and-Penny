const { MessageAttachment } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
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

function toHex(hud) {
	let hex;

	switch (hud) {
	case 'black':
		hex = '#202020';
		break;
	case 'blue':
		hex = '#0080ff';
		break;
	case 'brown':
		hex = '#800000';
		break;
	case 'green':
		hex = '#00ff00';
		break;
	case 'giorno':
		hex = '#e0c000';
		break;
	case 'grey':
		hex = '#808080';
		break;
	case 'l':
		hex = '#101010';
		break;
	case 'lux':
		hex = '#500090';
		break;
	case 'lelouch':
		hex = '#400080';
		break;
	case 'orange':
		hex = '#ff8000';
		break;
	case 'pink':
		hex = '#ff00ff';
		break;
	case 'purple':
		hex = '#8000ff';
		break;
	case 'red':
		hex = '#ff0000';
		break;
	case 'yellow':
		hex = '#ffff00';
		break;
	}

	return hex;
}

module.exports = {
	name: 'profile',
	aliases: ['p'],
	category: 'Economia e Perfil',
	description: 'Vê o teu perfil ou o de alguém!\nOpções disponíveis: `create`, `sethud`, `setnickname`, `setdescription`',
	usage: '`+profile [opcional - opção | @membro]`',

	execute(bot, message, command, args, db) {
		const user = message.mentions.users.first() || message.author,
			refP = db.collection('perfis').doc(user.id),
			refI = db.collection('inventário').doc(message.author.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'create':
			refP.get().then(doc => {
				if (doc.exists) {
					if (user == message.author) {
						message.channel.send('Já tens um perfil criado, não podes criar outro! 💢');
					}
				}
				else {
					db.collection('perfis').doc(message.author.id).set({
						balance: 0,
						hud: 'grey',
						description: 'N/A',
						id: user.id,
						lastDaily: '01/01/1970',
						level: 1,
						name: user.tag,
						nickname: 'N/A',
						xp: 0,
					}).then(() => {
						refI.set({
							huds: ['grey'],
						}).then(() => {
							message.reply('o teu perfil foi criado! Adiciona uma descricão com `+profile setdescription [descrição]`!');
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
						message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else if (args.length > 32) {
					message.reply(`o limite máximo de caracteres para a alcunha é de 32!\nEssa alcunha tem ${args.length}.`);
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
						message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else if (args.length > 44) {
					message.reply(`o limite máximo de caracteres para a descrição é de 44!\nEssa descrição tem ${args.length}.`);
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
						message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else {
					refI.get().then(docI => {
						const huds = docI.get('huds'),
							newHud = args;

						if (!newHud || newHud == '') {
							message.reply('não escolheste um HUD!');
						}
						else if (!huds.includes(`${newHud}`)) {
							message.reply('não tens esse HUD!');
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
						message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
					else if (user == bot.user) {
						message.reply('nós não precisamos de ter um perfil!');
					}
					else if (user.bot) {
						message.reply('os bots não criam perfis! 😂 ');
					}
					else {
						message.reply(`${user.tag} ainda não criou um perfil!`);
					}
				}
				else {
					const nick = doc.get('nickname'),
						desc = doc.get('description'),
						bal = doc.get('balance'),
						hud = doc.get('hud'),
						xp = doc.get('xp'),
						level = doc.get('level');

					let nextLevel = 500 * Math.round(level * (level + 1) / 2),
						prevLevel = 500 * Math.round(level * (level - 1) / 2),
						newLevel = level,
						xpToNext = xp - prevLevel,
						xpNeeded = nextLevel - prevLevel;

					if (xp >= nextLevel) {
						newLevel = level + 1;
						nextLevel = 500 * Math.round(newLevel * (newLevel + 1) / 2),
						prevLevel = 500 * Math.round(newLevel * (newLevel - 1) / 2);
						xpToNext = xp - prevLevel;
						xpNeeded = nextLevel - prevLevel;
					}

					const canvas = createCanvas(640, 360),
						ctx = canvas.getContext('2d');

					const bg = await loadImage(`images/profile/hud (${hud}).png`);
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 0.4;
					ctx.fillStyle = 'white';
					ctx.fillRect(160, 172, 425, 30);
					ctx.fill();

					ctx.globalAlpha = 0.7;
					ctx.fillStyle = toHex(hud);
					ctx.fillRect(160, 172, ((100 / (nextLevel - prevLevel)) * (xp - prevLevel) * 4.25), 30);
					ctx.fill();
					ctx.globalAlpha = 1;

					ctx.font = '20px bold Comic Sans MS';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.textAlign = 'center';
					ctx.fillStyle = 'white';
					ctx.fillText(`${user.tag}`, 375, 60);

					ctx.font = '16px Comic Sans MS';
					ctx.fillStyle = 'white';
					ctx.fillText(`${nick}`, 375, 80);

					ctx.font = '18px Comic Sans MS';
					ctx.textAlign = 'left';
					ctx.fillText(`XP Total: ${xp}`, 160, 125);
					ctx.fillText(`Nível: ${newLevel}`, 160, 155);

					ctx.fillStyle = 'gold';
					ctx.textAlign = 'right';
					ctx.fillText(`Capital: ¤${bal}`, 585, 140);

					ctx.font = '18px Comic Sans MS';
					ctx.fillStyle = 'white';
					ctx.textAlign = 'left';
					ctx.fillText('Descrição:', 160, 245);
					ctx.fillText(`${desc}`, 160, 285);

					ctx.closePath();

					ctx.beginPath();

					ctx.arc(88, 62, 50, 0, Math.PI * 2, true);
					ctx.lineWidth = 4;
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 8;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.strokeStyle = 'white';
					ctx.stroke();

					ctx.font = '18px Comic Sans MS';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.textAlign = 'center';
					ctx.fillStyle = 'white';
					ctx.fillText(`${convert(xpToNext)} / ${convert(xpNeeded)}`, 370, 192);

					ctx.closePath();

					ctx.clip();

					const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
					ctx.drawImage (avatar, 34, 10, 110, 110);

					const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

					message.channel.send(attachment);
				}
			});
			break;
		}
	},
};