/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonInteraction, Message, MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, User } from 'discord.js';
import { registerFont, createCanvas, loadImage } from 'canvas';
import * as answers from '../data/quizAnswers.json';
import slugify from './slugify';
import { messaging } from 'firebase-admin';
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export function createQuizPage(message: Message, user: User, lang:Record<string, any>, prefix: string, embedName: string) {
	let embedToExport: MessageEmbed;
	let buttonRow: MessageActionRow;
	const mainEmbed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setAuthor(user.username, user.avatarURL())
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
		interaction.reply(lang.quiz.alreadyPlaying).catch(err => { console.error(err); });
	}
	else {
		interaction.update({ content: lang.quiz.starting, embeds: [], components: [] }).then(() => {

			alreadyPlaying.add(interaction.channelId);
	
			const points: Map<string, number> = new Map();
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
					const eyes = await loadImage(`img/quiz/anime/eyes/${rnd}.png`);
					const hud = await loadImage('img/quiz/anime/eyes/hud.png');
	
					ctx.drawImage(eyes, 24, 116, 354, 96);
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
					ctx.textAlign = 'left';
					ctx.fillText(`${lang.quiz.whoIsCharacter}`, 30, 76);
	
					const attachment = new MessageAttachment(canvas.toBuffer(), 'question.png');
	
					interaction.channel.send({ files: [attachment] }).catch(err => { console.error(err); });
	
					const filter = (msg: Message) => answers.animeEyes[rnd].includes(slugify(msg.content.toLowerCase()));
					const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });

					collector.on('collect', message => {
						message.reply(lang.quiz.correct).catch(err => { console.error(err); });
	
						if (!points.has(message.member.user.tag)) points.set(message.member.user.tag, 0);
	
						points.set(message.member.user.tag, points.get(message.member.user.tag) + 1);
					});
	
					collector.on('end', collected => {
						if (collected.size === 0) interaction.channel.send(lang.quiz.noCorrectAnswer);
	
						setTimeout(() => {
							if (--i) {
								loopQuestions(i);
							}
							else {
								const resultsEmbed = new MessageEmbed()
									.setTitle(lang.results)
									.setColor('DARK_PURPLE')
									.setDescription(lang.quiz.noOneScored);
	
								if (points.size !== 0)
								{
									const nParticipants = points.size;
									const keys = points.keys();
									const values = points.values();
									let description = '';
									
									for (let j = 0; j < nParticipants; j++) {
										description = description + `\n ${keys.next().value} - ${values.next().value} ${lang.quiz.points}`;
									}
	
									resultsEmbed.setDescription(description);
								}
	
								interaction.channel.send({ content: lang.quiz.ended, embeds: [resultsEmbed] }).catch(err => { console.error(err); });
								alreadyPlaying.delete(interaction.channelId);
							}
						});
					});
				}, 5000);
			})(10);
		});
	}
}

export function quizButtonHandler(button: ButtonInteraction, lang: Record<string, any>, prefix: string) {
	if (!button.customId.endsWith(button.user.id)) {
		button.reply({ content: lang.interaction.notAuthor, ephemeral: true });
	}
	else {
		if (button.customId.slice(0, -18).endsWith('Start')) {
			createQuizQuestion(button, button.user, lang);
		}
		else if (button.customId.slice(0, -18).endsWith('Close')) {
			button.update({ content: lang.quiz.closed, embeds: [], components: [] }).catch(err => { console.error(err); });
		}
		else {
			const toSend:any = createQuizPage(undefined, button.user, lang, prefix, button.customId.slice(0, -18));

			button.update({ embeds: [toSend[0]], components: [toSend[1]] }).catch(err => { console.error(err); });
		}
	}
}