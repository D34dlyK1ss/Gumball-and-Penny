import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, Message, User } from 'discord.js';
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import admin from 'firebase-admin';
import answers from '../data/quizAnswers.json';
import slugify from './slugify';
import getText from './getText';
GlobalFonts.registerFromPath('src/fonts/comic.ttf', 'Comic Sans MS');
GlobalFonts.registerFromPath('src/fonts/comicb.ttf', 'Comic Sans MS Bold');
GlobalFonts.registerFromPath('src/fonts/comici.ttf', 'Comic Sans MS Italic');
GlobalFonts.registerFromPath('src/fonts/comicz.ttf', 'Comic Sans MS Bold Italic');

export function createQuizPage(interaction: ChatInputCommandInteraction, user: User, lang:Record<string, any>, embedName: string) {
	let embed: EmbedBuilder;
	let buttonRow: ActionRowBuilder<ButtonBuilder>;
	const mainEmbed = new EmbedBuilder()
		.setColor('DarkPurple')
		.setTitle('Quiz')
		.addFields(
			{ name: '- Anime', value: '\u200B', inline: true }
		);

	switch (embedName) {
		case 'quizmainEmbed':
			embed = EmbedBuilder.from(mainEmbed)
				.setDescription(lang.command.quiz.mainDescription);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`quizanimeEmbed${user.id}`)
						.setLabel('Anime')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`quizClose${user.id}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'quizanimeEmbed':
			embed = EmbedBuilder.from(mainEmbed)
				.setDescription(lang.command.quiz.themeDescription)
				.setTitle('Quiz - Anime')
				.setFields([
					{ name: `- ${lang.eyes}`, value: '\u200B', inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`quizanimeEyesEmbed${user.id}`)
						.setLabel(lang.eyes)
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`quizmainEmbed${user.id}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`quizClose${user.id}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'quizanimeEyesEmbed':
			embed = EmbedBuilder.from(mainEmbed)
				.setDescription(lang.command.quiz.toStart)
				.setTitle(`Quiz - Anime (${lang.eyes})`)
				.setFields();

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`quizanimeEyesStart${user.id}`)
						.setLabel(lang.start)
						.setStyle(3),
					new ButtonBuilder()
						.setCustomId(`quizanimeEmbed${user.id}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`quizClose${user.id}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
	}

	return {embed, buttonRow};
}

export const alreadyPlaying: Set<string> = new Set();

export async function createQuizQuestion(interaction: ButtonInteraction, user: User, lang:Record<string, any>) {
	if (alreadyPlaying.has(interaction.channelId)) {
		await interaction.editReply(lang.command.quiz.alreadyPlaying);
	}
	else {
		const quiz = interaction.customId.slice(0, -23);

		switch (quiz) {
			case 'quizanimeEyes': {
				interaction.update({ content: getText(lang.command.quiz.starting, [lang.command.quiz.animeEyes]), embeds: [], components: [] }).then(() => {

					alreadyPlaying.add(interaction.channelId);
			
					const score: Map<string, number> = new Map();
					const alreadyAsked: number[] = [];
			
					(function loopQuestions(i) {
						setTimeout(async function() {
							let rnd = Math.floor(Math.random() * answers.animeEyes.length);
			
							while (alreadyAsked.includes(rnd)) {
								rnd = Math.floor(Math.random() * answers.animeEyes.length);
							}

							alreadyAsked.push(rnd);
			
							const canvas = createCanvas(401, 250);
							const ctx = canvas.getContext('2d');
							const eyes = await loadImage(`src/img/quiz/anime/eyes/${rnd}.png`);
							const hud = await loadImage('src/img/quiz/anime/eyes/hud.png');
			
							ctx.drawImage(eyes, 28, 120);
							ctx.drawImage(hud, 0, 0, canvas.width, canvas.height);
			
							ctx.globalAlpha = 0.4;
							ctx.fillStyle = 'black';
							ctx.fillRect(25, 30, 353, 72);
							ctx.fill();
							ctx.globalAlpha = 1;
			
							ctx.font = '26px bold Comic Sans MS';
							ctx.shadowColor = 'black';
							ctx.shadowBlur = 1;
							ctx.shadowOffsetX = 2;
							ctx.shadowOffsetY = 2;
							ctx.fillStyle = 'white';
							ctx.textAlign = 'center';
							ctx.fillText(lang.command.quiz.whoIsCharacter, 200, 76);
			
							const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'question.png' });
			
							interaction.channel.send({ files: [attachment] });
			
							const filter = (msg: Message) => answers.animeEyes[rnd].includes(slugify(msg.content.toLowerCase()));
							const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
		
							collector.on('collect', message => {
								message.reply(lang.command.quiz.correct);
								
								if (!score.has(message.member.id)) score.set(message.member.id, 0);
			
								score.set(message.member.id, score.get(message.member.id) + 1);
							});
			
							collector.on('end', collected => {
								if (collected.size === 0) interaction.channel.send(lang.command.quiz.noCorrectAnswer);
			
								setTimeout(async () => {
									if (--i) {
										loopQuestions(i);
									}
									else {
										const resultsEmbed = new EmbedBuilder()
											.setTitle(lang.results)
											.setColor('DarkPurple')
											.setDescription(lang.command.quiz.noOneScored);
										
										const sortedScore = new Map([...score.entries()].sort((a, b) => b[1] - a[1]));
			
										if (sortedScore.size !== 0)
										{
											const nParticipants = sortedScore.size;
											const userIds = sortedScore.keys();
											const points = sortedScore.values();
											let description = '';

											for (let j = 0; j < nParticipants; j++) {
												const userId = userIds.next().value;
												const userScore = points.next().value;
												const refP = admin.firestore().collection('perfis').doc(`${user}`);
												let plural = '';

												userScore !== 1 ? plural = 's' : plural = '';

												description = description + getText(lang.command.quiz.points, [userId, userScore]) + plural;

												await refP.get().then(doc => {
													if (!doc.exists) return;
													const xp: number = doc.get('xp');
													const balance: number = doc.get('balance');
													const xpGain = 20 * userScore + (50 * nParticipants - 1);
													const moneyGain = (100 * userScore + 50) * (nParticipants - 1);

													refP.update({
														xp: xp + xpGain,
														balance: balance + moneyGain
													});
												});
											}
			
											resultsEmbed.setDescription(description);
										}
			
										interaction.channel.send({ content: lang.command.quiz.ended, embeds: [resultsEmbed] });
										alreadyPlaying.delete(interaction.channelId);
									}
								});
							});
						}, 5000);
					})(10);
				});
			}
				break;
		}
	}
}

export function quizButtonHandler(button: ButtonInteraction, lang: Record<string, any>) {
	if (!button.customId.endsWith(button.user.id)) {
		button.reply({ content: lang.error.notAuthor });
	}
	else {
		if (button.customId.slice(0, -18).endsWith('Start')) {
			createQuizQuestion(button, button.user, lang);
		}
		else if (button.customId.slice(0, -18).endsWith('Close')) {
			button.update({ content: lang.command.quiz.exited, embeds: [], components: [] });
		}
		else {
			const page = createQuizPage(undefined, button.user, lang, button.customId.slice(0, -18));

			button.update({ embeds: [page.embed], components: [page.buttonRow] });
		}
	}
}