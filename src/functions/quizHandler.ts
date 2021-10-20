import { ButtonInteraction, Message, MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, User } from 'discord.js';
import { registerFont, createCanvas, loadImage } from 'canvas';
import * as admin from 'firebase-admin';
import * as answers from '../data/quizAnswers.json';
import slugify from './slugify';
import getText from './getText';
registerFont('src/fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('src/fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('src/fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('src/fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export function createQuizPage(message: Message, user: User, lang:Record<string, any>, prefix: string, embedName: string) {
	let embedToExport: MessageEmbed;
	let buttonRow: MessageActionRow;
	const mainEmbed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setAuthor(user.tag, user.avatarURL())
		.setTitle('Quiz')
		.addFields(
			{ name: '- Anime', value: '\u200B', inline: true }
		);

	switch (embedName) {
		case 'quizmainEmbed':
			embedToExport = new MessageEmbed(mainEmbed)
				.setDescription(lang.quiz.mainDescription);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`quizanimeEmbed${user.id}`)
						.setLabel('Anime')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`quizClose${user.id}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'quizanimeEmbed':
			embedToExport = new MessageEmbed(mainEmbed)
				.setDescription(lang.quiz.themeDescription)
				.setTitle('Quiz - Anime')
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: `- ${lang.eyes}`, value: '\u200B', inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`quizanimeEyesEmbed${user.id}`)
						.setLabel(lang.eyes)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`quizmainEmbed${user.id}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`quizClose${user.id}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'quizanimeEyesEmbed':
			embedToExport = new MessageEmbed(mainEmbed)
				.setDescription(lang.quiz.toStart)
				.setTitle(`Quiz - Anime (${lang.eyes})`)
				.spliceFields(0, mainEmbed.fields.length);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`quizanimeEyesStart${user.id}`)
						.setLabel(lang.start)
						.setStyle('SUCCESS'),
					new MessageButton()
						.setCustomId(`quizanimeEmbed${user.id}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`quizClose${user.id}`)
						.setLabel(lang.close)
						.setStyle('DANGER')
				);
			break;
	}

	return [embedToExport, buttonRow];
}

export const alreadyPlaying: Set<string> = new Set();

export function createQuizQuestion(interaction: ButtonInteraction, user: User, lang:Record<string, any>) {
	if (alreadyPlaying.has(interaction.channelId)) {
		interaction.reply(lang.quiz.alreadyPlaying);
	}
	else {
		const quiz = interaction.customId.slice(0, -23);

		switch (quiz) {
			case 'quizanimeEyes': {
				interaction.update({ content: getText(lang.quiz.starting, [lang.quiz.animeEyes]), embeds: [], components: [] }).then(() => {

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
							ctx.fillText(lang.quiz.whoIsCharacter, 200, 76);
			
							const attachment = new MessageAttachment(canvas.toBuffer(), 'question.png');
			
							interaction.channel.send({ files: [attachment] });
			
							const filter = (msg: Message) => answers.animeEyes[rnd].includes(slugify(msg.content.toLowerCase()));
							const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });
		
							collector.on('collect', message => {
								message.reply(lang.quiz.correct);
			
								if (!score.has(message.member.id)) score.set(message.member.id, 0);
			
								score.set(message.member.id, score.get(message.member.id) + 1);
							});
			
							collector.on('end', collected => {
								if (collected.size === 0) interaction.channel.send(lang.quiz.noCorrectAnswer);
			
								setTimeout(async () => {
									if (--i) {
										loopQuestions(i);
									}
									else {
										const resultsEmbed = new MessageEmbed()
											.setTitle(lang.results)
											.setColor('DARK_PURPLE')
											.setDescription(lang.quiz.noOneScored);
										
										const sortedScore = new Map([...score.entries()].sort((a, b) => b[1] - a[1]));
			
										if (sortedScore.size !== 0)
										{
											const nParticipants = sortedScore.size;
											const userIds = sortedScore.keys();
											const points = sortedScore.values();
											let description = '';

											for (let j = 0; j < nParticipants; j++) {
												const userId = userIds.next().value;
												const punctuation = points.next().value;
												const refP = admin.firestore().collection('perfis').doc(`${user}`);
												let plural = '';

												punctuation !== 1 ? plural = 's' : plural = '';

												description = description + getText(lang.quiz.points, [userId, punctuation]) + plural;

												await refP.get().then(doc => {
													if (!doc.exists) return;
													const xp: number = doc.get('xp');
													const xpGain = 25 * punctuation + 50 * (nParticipants - 1);

													refP.update({
														xp: xp + xpGain
													});
												});
											}
			
											resultsEmbed.setDescription(description);
										}
			
										interaction.channel.send({ content: lang.quiz.ended, embeds: [resultsEmbed] });
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

export function quizButtonHandler(button: ButtonInteraction, lang: Record<string, any>, prefix: string) {
	if (!button.customId.endsWith(button.user.id)) {
		button.reply({ content: lang.error.notAuthor, ephemeral: true });
	}
	else {
		if (button.customId.slice(0, -18).endsWith('Start')) {
			createQuizQuestion(button, button.user, lang);
		}
		else if (button.customId.slice(0, -18).endsWith('Close')) {
			button.update({ content: lang.quiz.closed, embeds: [], components: [] });
		}
		else {
			const toSend:any = createQuizPage(undefined, button.user, lang, prefix, button.customId.slice(0, -18));

			button.update({ embeds: [toSend[0]], components: [toSend[1]] });
		}
	}
}