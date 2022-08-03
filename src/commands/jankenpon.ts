import { ChatInputCommandInteraction, AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

const min = 50;
const max = 1000;

export = {
	data: new SlashCommandBuilder()
		.setName('jankenpon')
		.setDescription(enLang.command.jankenpon.description)
		.addStringOption(option =>
			option.setName('guess')
				.setDescription(enLang.command.jankenpon.guessDesc)
				.setChoices(
					{ name: 'Gumball', value: 'Gumball' },
					{ name: 'Penny', value: 'Penny' }
				)
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription(enLang.command.jankenpon.amountDesc)
				.setMinValue(min)
				.setMaxValue(max)
				.setRequired(true)
		),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const ref = db.collection('perfis').doc(interaction.user.id);
		
		ref.get().then(async doc => {
			const money = interaction.options.getInteger('amount');

			if (!doc.exists) {
				interaction.reply(lang.error.noProfile);
			}
			else {
				const bal: number = doc.get('balance');
		
				if (bal + money > 1000000) {
					interaction.reply(lang.error.noAdd);
				}
				else if (money > bal) {
					interaction.reply(lang.error.noMoney);
				}
				else if (money < min) {
					interaction.reply(getText(lang.betAtLeast, [min]));
				}
				else if (money > max) {
					interaction.reply(getText(lang.betAtMost, [max]));
				}
				else {
					const gumballRandom = Math.round(Math.random() * 2);
					const pennyRandom = Math.round(Math.random() * 2);
					const guess = interaction.options.getString('guess');
					const array = [lang.command.jankenpon.rock, lang.command.jankenpon.paper, lang.command.jankenpon.scissors];
					let finalRes;
		
					const animation = new AttachmentBuilder('src/img/jankenpon/animation.gif');
					const canvas = createCanvas(400, 200);
					const ctx = canvas.getContext('2d');
		
					const gumball = await loadImage(`src/img/jankenpon/gumball (${gumballRandom}).png`);
					const penny = await loadImage(`src/img/jankenpon/penny (${pennyRandom}).png`);
					ctx.drawImage(gumball, 0, 0, 200, 200);
					ctx.drawImage(penny, 200, 0, 200, 200);
		
					const imageRes = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile.png'});
		
					interaction.reply({ files: [animation] }).then(() => {
						setTimeout(async () => {
							if (gumballRandom === 0 && pennyRandom === 2) finalRes = 'Gumball';
							else if (pennyRandom === 0 && gumballRandom === 2) finalRes = 'Penny';
							else if (gumballRandom > pennyRandom) finalRes = 'Gumball';
							else if (pennyRandom > gumballRandom) finalRes = 'Penny';
							else finalRes = 0;
		
							const gumballRes = array[gumballRandom];
							const pennyRes = array[pennyRandom];
							const messageRes = getText(lang.command.jankenpon.threw, [gumballRes, pennyRes]);
		
							if (finalRes === 0) {
								await interaction.editReply({ content: `${messageRes} ${lang.command.jankenpon.draw}`, files: [imageRes] });
							}
							else if (finalRes !== guess) {
								ref.update({
									balance: bal - money
								}).then(async () => {
									await interaction.editReply({ content: `${messageRes} ${getText(lang.lost, [money])}`, files: [imageRes] });
								});
							}
							else if (finalRes === guess) {
								const won = money * 1.5;
		
								ref.update({
									balance: bal + won
								}).then(async () => {
									await interaction.editReply({ content: `${messageRes} ${getText(lang.won, [won])}`, files: [imageRes] });
								});
							}
						}, 2000); });
				}
			}
		});
	}
};