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
	name: 'rank',
	category: 'Perfil',
	description: 'Verifica o teu nível e XP!',
	usage: '`+rank`',
	execute(bot, message, command, args, db) {
		const user = message.mentions.users.first() || message.author;
		db.collection('perfis').doc(user.id).get().then(async doc => {
			if (!doc.exists) {
				if (user == message.author) {
					message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
				}
				else if (user == bot.user) {
					message.reply('nós não precisamos de ter nível!');
				}
				else if (user.bot) {
					message.reply('os bots não criam perfis! 😂 ');
				}
				else {
					message.reply(`${user.tag} ainda não criou um perfil!`);
				}
			}
			else {
				const rank = doc.get('rank'),
					xp = doc.get('xp');
				const nextRank = 500 * Math.round(rank * (rank + 1) / 2),
					prevRank = 500 * Math.round(rank * (rank - 1) / 2);

				const canvas = createCanvas(1000, 333),
					ctx = canvas.getContext('2d');

				const bg = await loadImage('images/profile/rank.jpg');
				ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

				ctx.beginPath();

				ctx.globalAlpha = 0.2;
				ctx.fillStyle = 'white';
				ctx.fillRect(180, 225, 770, 65);
				ctx.fill();
				ctx.globalAlpha = 1;

				ctx.fillStyle = '#8000ff';
				ctx.fillRect(180, 225, ((100 / nextRank) * (xp - prevRank) * 7.7), 65);
				ctx.fill();

				ctx.lineWidth = 5;
				ctx.strokeStyle = 'white';
				ctx.strokeRect(180, 225, 770, 65);
				ctx.stroke();

				ctx.arc(170, 170, 120, 0, Math.PI * 2, true);
				ctx.lineWidth = 6;
				ctx.strokeStyle = 'white';
				ctx.stroke();

				ctx.font = 'bold 42px Helvetica';
				ctx.shadowColor = 'black';
				ctx.shadowBlur = 4;
				ctx.shadowOffsetX = 4;
				ctx.shadowOffsetY = 4;
				ctx.textAlign = 'center';
				ctx.fillStyle = 'white';
				ctx.fillText(`${convert(xp - prevRank)} / ${convert(nextRank)}`, 600, 274);

				ctx.textAlign = 'left';
				ctx.fillText(`${user.tag}`, 320, 140);
				ctx.fillText(`Rank: ${rank}`, 320, 190);
				ctx.closePath();
				ctx.clip();

				const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
				ctx.drawImage (avatar, 40, 40, 250, 250);

				const attachment = new MessageAttachment(canvas.toBuffer(), 'rank.png');

				message.channel.send(attachment);
			}
		});
	},
};
