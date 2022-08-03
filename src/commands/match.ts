import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import getText from '../functions/getText';
import enLang from '../lang/en.json';
GlobalFonts.registerFromPath('src/fonts/comic.ttf', 'Comic Sans MS');
GlobalFonts.registerFromPath('src/fonts/comicb.ttf', 'Comic Sans MS Bold');
GlobalFonts.registerFromPath('src/fonts/comici.ttf', 'Comic Sans MS Italic');
GlobalFonts.registerFromPath('src/fonts/comicz.ttf', 'Comic Sans MS Bold Italic');

export = {
	data: new SlashCommandBuilder()
		.setName('match')
		.setDescription(enLang.command.match.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.match.memberDesc)
				.setRequired(true)
		),

	async execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const otherUser = interaction.options.getUser('member');
		const userLast = parseInt(interaction.user.id.slice(-2));
		const otherUserLast = parseInt(otherUser.id.slice(-2));
		const compatibility = Math.ceil((userLast + otherUserLast) / 2);
		
		if (otherUser === interaction.user) {
			interaction.reply(lang.error.noSelf);
		}
		else if (otherUser === bot.user) {
			interaction.reply(lang.command.match.alreadyAPair);
		}
		else if (otherUser.bot) {
			interaction.reply(lang.error.wontWorkOnBot);
		}
		else {
			const canvas = createCanvas(401, 250);
			const ctx = canvas.getContext('2d');
		
			ctx.beginPath();
		
			ctx.fillStyle = '#660000';
			ctx.fillRect(146, 89, 109, 100);
			ctx.fill();
		
			ctx.fillStyle = '#cc0000';
			ctx.fillRect(146, 189, 109, -compatibility);
			ctx.fill();
		
			ctx.closePath();
		
			const bg = await loadImage('src/img/match/bg.png');
			ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		
			const userAvatar = await loadImage(interaction.user.displayAvatarURL({ extension: 'png' }));
			const otherUserAvatar = await loadImage(otherUser.displayAvatarURL({ extension: 'png' }));
		
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
			ctx.fillText(getText(lang.command.match.youAre, [compatibility]), 200, 57);
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
		
			const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'match.png'});
		
			interaction.reply({ files: [attachment] });
		}
	}
};