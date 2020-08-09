const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(1000, 333);
const ctx = canvas.getContext('2d');

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
	name: 'level',
	category: 'Perfil',
	description: 'Verifica o teu nível e XP!',
	usage: '`+level`',
	execute(bot, message, command, args, db) {
		const user = message.mentions.users.first() || message.author;
		db.collection('perfis').doc(user.id).get().then(async doc => {
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
					message.reply(`${user} ainda não criou um perfil!`);
				}
			}
			else {
				const level = doc.get('level'),
					xp = doc.get('xp');
				const nextLevel = 500 * Math.round(level * (level + 1) / 2);

				ctx.fillStyle = '#404040';
				ctx.fillRect(0, 0, 1000, 333);

				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#ffffff';
				ctx.globalAlpha = 0.2;
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(180, 226, 770, 65);
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.strokeRect(180, 226, 770, 65);
				ctx.stroke();

				ctx.fillStyle = '#8000ff';
				ctx.globalAlpha = 0.5;
				ctx.fillRect(180, 226, ((100 / nextLevel) * xp * 7.7), 65);
				ctx.fill();
				ctx.globalAlpha = 1;

				ctx.font = '40px Comic Sans MS';
				ctx.textAlign = 'center';
				ctx.fillStyle = '#ffffff';
				ctx.fillText(`${convert(xp)} XP / ${convert(nextLevel)}`, 600, 270);

				ctx.textAlign = 'left';
				ctx.fillText(`${user.tag}`, 320, 140);
				ctx.fillText(`Level: ${level}`, 320, 190);

				ctx.arc(170, 170, 120, 0, Math.PI * 2, true);
				ctx.lineWidth = 6;
				ctx.strokeStyle = '#ffffff';
				ctx.stroke();
				ctx.closePath();
				ctx.clip();

				const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
				ctx.drawImage (avatar, 40, 40, 250, 250);


				const attachment = new MessageAttachment(canvas.toBuffer(), 'level.png');

				message.channel.send(attachment);
			}
		});
	},
};
