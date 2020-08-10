/* eslint-disable no-unused-vars */
const { MessageAttachment } = require('discord.js');
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
						level = doc.get('level'),
						xp = doc.get('xp');
					const nextLevel = 500 * Math.round(level * (level + 1) / 2),
						prevLevel = 500 * Math.round(level * (level - 1) / 2);

					const canvas = createCanvas(500, 500),
						ctx = canvas.getContext('2d');

					const bg = await loadImage('images/profile/profile.jpg');
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 0.6;
					ctx.fillStyle = 'grey';
					ctx.fillRect(100, 100, 350, 60);
					ctx.fill();

					ctx.fillStyle = 'white';
					ctx.fillRect(100, 160, 350, 290);
					ctx.fill();

					ctx.globalAlpha = 0.2;
					ctx.fillStyle = 'white';
					ctx.fillRect(110, 310, 330, 40);
					ctx.fill();

					ctx.globalAlpha = 0.9;
					ctx.fillStyle = '#8000ff';
					ctx.fillRect(110, 310, ((100 / nextLevel) * (xp - prevLevel) * 3.3), 40);
					ctx.fill();

					ctx.arc(100, 100, 60, 0, Math.PI * 2, true);
					ctx.lineWidth = 4;
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 8;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.strokeStyle = 'white';
					ctx.stroke();

					ctx.lineWidth = 1;
					ctx.moveTo(125, 380);
					ctx.lineTo(425, 380);
					ctx.strokeStyle = 'black';
					ctx.stroke();

					ctx.font = 'bold 22px Helvetica';
					ctx.textAlign = 'center';
					ctx.fillStyle = 'white';
					ctx.fillText(`${user.tag}`, 305, 125);

					ctx.font = '16px Helvetica';
					ctx.fillStyle = 'white';
					ctx.fillText(`${nick}`, 305, 150);

					ctx.font = '18px Helvetica';
					ctx.fillStyle = 'black';
					ctx.textAlign = 'left';
					ctx.fillText(`XP Total: ${xp}`, 120, 230);

					ctx.font = 'bold 16px Helvetica';
					ctx.fillText('Descrição:', 120, 410);

					ctx.font = '14px Helvetica';
					ctx.fillText(`${desc}`, 120, 430);

					ctx.font = '18px Helvetica';
					ctx.fillStyle = 'gold';
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.fillText(`Capital: ¤${bal}`, 120, 265);

					ctx.font = '28px Helvetica';
					ctx.fillStyle = 'white';
					ctx.textAlign = 'center';
					ctx.fillText('NÍVEL:', 370, 230);

					ctx.font = 'bold 48px Helvetica';
					ctx.fillText(`${level}`, 370, 280);

					ctx.font = '20px Helvetica';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 4;
					ctx.shadowOffsetY = 4;
					ctx.textAlign = 'center';
					ctx.fillStyle = 'white';
					ctx.fillText(`${convert(xp - prevLevel)} / ${convert(nextLevel - prevLevel)}`, 275, 336);

					ctx.closePath();

					ctx.clip();

					const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
					ctx.drawImage (avatar, 35, 40, 125, 125);

					const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

					message.channel.send(attachment);
				}
			});
			break;
		}
	},
};