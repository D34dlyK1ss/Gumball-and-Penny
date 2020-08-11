const { MessageAttachment, MessageEmbed } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

function convert(value) {
	if (value >= 1000000) {
		value = (value / 1000000) + 'M';
	}
	else if (value >= 1000) {
		value = (value / 1000) + 'k';
	}
	return value;
}

function toHex(color) {
	let hex;

	switch (color) {
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
	default:
		hex = '#808080';
		break;
	}

	return hex;
}

module.exports = {
	name: 'profile',
	aliases: ['p'],
	category: 'Perfil',
	description: 'Vê o teu perfil ou o de alguém!\nOpções disponíveis: `create`, `setnickname`, `setdescription`',
	usage: '`+profile [opcional - opção | @membro]`',

	execute(bot, message, command, args, db) {
		const user = message.mentions.users.first() || message.author,
			ref = db.collection('perfis').doc(user.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'create':
			ref.get().then(doc => {
				if (doc.exists) {
					if (user == message.author) {
						message.channel.send('Já tens um perfil criado, não podes criar outro! 💢');
					}
				}
				else {
					db.collection('perfis').doc(message.author.id).set({
						balance: 0,
						color: 'grey',
						description: 'N/A',
						id: user.id,
						lastDaily: '01/01/1970',
						level: 1,
						name: user.tag,
						nickname: 'N/A',
						xp: 0,
					}).then(() => {
						message.reply('o teu perfil foi criado! Adiciona uma descricão com `+profile setdescription [descrição]`!');
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setnickname':
			if (args == '') args = 'N/A';
			ref.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else if (args.length > 32) {
					message.reply('o limite máximo de caracteres para a alcunha é de 32!');
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
			ref.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else if (args.length > 32) {
					message.reply('o limite máximo de caracteres para a descrição é de 32!');
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
		case 'setcolor':
			ref.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else {
					const color = doc.get('color'),
						filter = (reaction, member) => ['🕷️', '🦋', '🐻', '🐸', '🐨', '🦊', '🦑', '🐙', '🐞', '🐯'].includes(reaction.emoji.name) && member.id === message.author.id,
						embed = new MessageEmbed()
							.setAuthor(`${message.author.tag}`)
							.setTitle('Escolhe uma cor')
							.setColor(toHex(color));

					message.channel.send(embed).then(async msg => {
						msg.awaitReactions(filter, {
							max: 1, time: 60000, errors: ['time'],
						}).then(collected => {

							const reaction = collected.first();

							switch (reaction.emoji.name) {
							case '🕷️':
								db.collection('perfis').doc(message.author.id).update({
									color: 'black',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🦋':
								db.collection('perfis').doc(message.author.id).update({
									color: 'blue',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🐻':
								db.collection('perfis').doc(message.author.id).update({
									color: 'brown',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🐸':
								db.collection('perfis').doc(message.author.id).update({
									color: 'green',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🐨':
								db.collection('perfis').doc(message.author.id).update({
									color: 'grey',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🦊':
								db.collection('perfis').doc(message.author.id).update({
									color: 'orange',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🦑':
								db.collection('perfis').doc(message.author.id).update({
									color: 'pink',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🐙':
								db.collection('perfis').doc(message.author.id).update({
									color: 'purple',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🐞':
								db.collection('perfis').doc(message.author.id).update({
									color: 'red',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							case '🐯':
								db.collection('perfis').doc(message.author.id).update({
									color: 'yellow',
								}).then(() => {
									msg.delete();
									message.reply('a cor do teu perfil foi alterada!');
								}).catch(err => { console.error(err); });
								break;
							}
						}).catch(() => {
							msg.delete();
							message.reply('não selecionaste cor nenhuma!');
						});

						try {
							msg.react('🕷️');
							await msg.react('🦋');
							await msg.react('🐻');
							await msg.react('🐸');
							await msg.react('🐨');
							await msg.react('🦊');
							await msg.react('🦑');
							await msg.react('🐙');
							await msg.react('🐞');
							await msg.react('🐯');
						}
						catch {
							return;
						}
					});
				}
			});
			break;
		default:
			ref.get().then(async doc => {
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
						color = doc.get('color'),
						xp = doc.get('xp'),
						level = doc.get('level');

					const nextLevel = 500 * Math.round(level * (level + 1) / 2),
						prevLevel = 500 * Math.round(level * (level - 1) / 2);

					let newLevel = level,
						xpToNext = xp - prevLevel,
						xpNeeded = nextLevel - prevLevel;

					if (xp > nextLevel) {
						newLevel = level + 1;
						xpToNext = xp - prevLevel;
						xpNeeded = nextLevel - prevLevel;
					}

					const canvas = createCanvas(640, 360),
						ctx = canvas.getContext('2d');

					const bg = await loadImage(`images/profile/profile (${color}).png`);
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 0.4;
					ctx.fillStyle = 'white';
					ctx.fillRect(160, 170, 425, 30);
					ctx.fill();

					ctx.globalAlpha = 0.8;
					ctx.fillStyle = toHex(color);
					ctx.fillRect(160, 170, ((100 / (nextLevel - prevLevel)) * (xp - prevLevel) * 4.25), 30);
					ctx.fill();
					ctx.globalAlpha = 1;

					ctx.font = 'bold 20px Helvetica';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.textAlign = 'center';
					ctx.fillStyle = 'white';
					ctx.fillText(`${user.tag}`, 375, 60);

					ctx.font = '16px Helvetica';
					ctx.fillStyle = 'white';
					ctx.fillText(`${nick}`, 375, 80);

					ctx.font = '14px Helvetica';
					ctx.fillText(`${desc}`, 395, 140);

					ctx.font = '16px Helvetica';
					ctx.textAlign = 'left';
					ctx.fillText(`XP Total: ${xp}`, 160, 125);

					ctx.fillStyle = 'gold';
					ctx.fillText(`Capital: ¤${bal}`, 160, 155);

					ctx.font = '20px Helvetica';
					ctx.fillStyle = 'white';
					ctx.textAlign = 'center';
					ctx.fillText('NÍVEL', 555, 130);

					ctx.font = 'bold 24px Helvetica';
					ctx.fillText(`${newLevel}`, 555, 156);

					ctx.font = 'italic bold 11px Helvetica';
					ctx.globalAlpha = 0.6;
					ctx.textAlign = 'right';
					ctx.fillText('Em breve...', 585, 315);
					ctx.globalAlpha = 1;

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

					ctx.font = '18px Helvetica';
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