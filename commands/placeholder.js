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
	name: 'placeholder',
	aliases: ['ph'],
	category: 'Perfil',
	description: 'Vê o teu perfil ou o de alguém!\nOpções disponíveis: `create`, `setnickname`, `setdescription`',
	usage: '`+profile [opcional - opção | @membro]`',

	execute(bot, message, command, args, db) {
		const user = message.mentions.users.first() || message.author,
			ref = db.collection('perfis').doc(user.id);
		args = args.slice(1);
		args = args.join(' ');

		ref.get().then(async doc => {
			if (!doc.exists) {
				return;
			}
			else {
				const nick = doc.get('nickname'),
					desc = doc.get('description'),
					bal = doc.get('balance');
				let xp = doc.get('xp'),
					level = doc.get('level');
				const nextLevel = 500 * Math.round(level * (level + 1) / 2),
					prevLevel = 500 * Math.round(level * (level - 1) / 2);
				const xpToNext = xp - prevLevel,
					xpNeeded = nextLevel - prevLevel;

				if (xp > nextLevel) {
					level++;
					xp = nextLevel;
				}

				const canvas = createCanvas(640, 360),
					ctx = canvas.getContext('2d');

				const bg = await loadImage('images/profile/placeholder.png');
				ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

				ctx.beginPath();

				ctx.globalAlpha = 0.4;
				ctx.fillStyle = 'white';
				ctx.fillRect(160, 170, 425, 30);
				ctx.fill();

				ctx.globalAlpha = 0.8;
				ctx.fillStyle = '#8000ff';
				ctx.fillRect(160, 170, ((100 / (nextLevel - prevLevel)) * (xp - prevLevel) * 4.25), 30);
				ctx.fill();
				ctx.globalAlpha = 1;

				ctx.font = 'bold 20px Helvetica';
				ctx.textAlign = 'center';
				ctx.fillStyle = 'white';
				ctx.fillText(`${user.tag}`, 375, 60);

				ctx.font = '16px Helvetica';
				ctx.fillStyle = 'white';
				ctx.fillText(`${nick}`, 375, 80);

				ctx.font = '12px Helvetica';
				ctx.fillText(`${desc}`, 400, 140);

				ctx.font = '14px Helvetica';
				ctx.textAlign = 'left';
				ctx.fillText(`XP Total: ${xp}`, 160, 125);

				ctx.fillStyle = 'gold';
				ctx.shadowColor = 'black';
				ctx.shadowBlur = 4;
				ctx.shadowOffsetX = 4;
				ctx.shadowOffsetY = 4;
				ctx.fillText(`Capital: ¤${bal}`, 160, 155);

				ctx.font = '22px Helvetica';
				ctx.fillStyle = 'white';
				ctx.textAlign = 'center';
				ctx.fillText('NÍVEL', 555, 130);

				ctx.font = 'bold 28px Helvetica';
				ctx.fillText(`${level}`, 555, 156);

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
				ctx.fillText(`${convert(xpToNext)} / ${convert(xpNeeded)}`, 380, 192);

				ctx.closePath();

				ctx.clip();

				const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
				ctx.drawImage (avatar, 36, 10, 110, 110);

				const attachment = new MessageAttachment(canvas.toBuffer(), 'profile.png');

				message.channel.send(attachment);
			}
		});
	},
};