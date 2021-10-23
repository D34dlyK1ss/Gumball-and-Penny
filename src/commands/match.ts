import { Message, MessageAttachment } from 'discord.js';
import { BotClient, Cmd } from 'index';
import { registerFont, createCanvas, loadImage } from 'canvas';
import getText from '../functions/getText';
registerFont('src/fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('src/fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('src/fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('src/fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export const name = 'match';
export async function execute(bot: BotClient, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
	const otherUser = message.mentions.users.first();

	if (!otherUser) {
		message.reply(lang.error.noMention);
	}
	else {
		const userLast = parseInt(message.member.id.slice(-2));
		const otherUserLast = parseInt(otherUser.id.slice(-2));
		const probability = Math.ceil((userLast + otherUserLast) / 2);

		if (otherUser === message.author) {
			message.reply(lang.error.noSelf);
		}
		else if (otherUser === bot.user) {
			message.channel.send(lang.match.alreadyAPair);
		}
		else if (otherUser.bot) {
			message.reply(lang.error.wontWorkOnBot);
		}
		else {
			const canvas = createCanvas(401, 250);
			const ctx = canvas.getContext('2d');

			ctx.beginPath();

			ctx.fillStyle = '#660000';
			ctx.fillRect(146, 89, 109, 100);
			ctx.fill();

			ctx.fillStyle = '#cc0000';
			ctx.fillRect(146, 189, 109, -probability);
			ctx.fill();

			ctx.closePath();

			const bg = await loadImage('src/img/match/bg.png');
			ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

			const userAvatar = await loadImage(message.author.displayAvatarURL({ format: 'png' }));
			const otherUserAvatar = await loadImage(otherUser.displayAvatarURL({ format: 'png' }));

			ctx.save();
			ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
			ctx.fillRect(74, 30, 254, 40);
			ctx.fill();

			ctx.font = '18px Comic Sans MS';
			ctx.shadowColor = 'black';
			ctx.shadowBlur = 1;
			ctx.shadowOffsetX = 2;
			ctx.shadowOffsetY = 2;
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText(getText(lang.match.youAre, [probability]), 200, 57);
			ctx.restore();

			ctx.beginPath();
			ctx.arc(76, 139, 55, 0, Math.PI * 2, true);
			ctx.lineWidth = 6;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			
			ctx.save();
			ctx.clip();
			ctx.drawImage(userAvatar, 21, 84, 110, 110);
			ctx.restore();

			ctx.beginPath();
			ctx.arc(325, 139, 55, 0, Math.PI * 2, true);
			ctx.lineWidth = 6;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			
			ctx.save();
			ctx.clip();
			ctx.drawImage(otherUserAvatar, 270, 84, 110, 110);
			ctx.restore();

			const attachment = new MessageAttachment(canvas.toBuffer(), 'match.png');

			message.reply({ files: [attachment] });
		}
	}
}