import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import botConfig from '../../botConfig.json';
import items from '../data/itemlist.json';
import convert from '../functions/convert';
import getText from '../functions/getText';
import enLang from '../lang/en.json';
GlobalFonts.registerFromPath('src/fonts/comic.ttf', 'Comic Sans MS');
GlobalFonts.registerFromPath('src/fonts/comicb.ttf', 'Comic Sans MS Bold');
GlobalFonts.registerFromPath('src/fonts/comici.ttf', 'Comic Sans MS Italic');
GlobalFonts.registerFromPath('src/fonts/comicz.ttf', 'Comic Sans MS Bold Italic');

const nickMax = 40;
const descMax = 52;

export = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription(enLang.command.profile.description)
		.addSubcommand(subcommand =>
			subcommand.setName('check')
				.setDescription(enLang.command.profile.checkDesc)
				.addUserOption(option =>
					option.setName('member')
						.setDescription(enLang.command.profile.memberDesc)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('create')
				.setDescription(enLang.command.profile.createDesc)
		)
		.addSubcommandGroup(group =>
			group.setName('set')
				.setDescription(enLang.command.profile.setnicknameDesc)
				.addSubcommand(subcommand =>
					subcommand.setName('nickname')
						.setDescription(enLang.command.profile.setnicknameDesc)
						.addStringOption(option =>
							option.setName('newnickname')
								.setDescription(enLang.command.profile.newnicknameDesc)
								.setMaxLength(nickMax)
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand.setName('description')
						.setDescription(enLang.command.profile.setdescriptionDesc)
						.addStringOption(option =>
							option.setName('newdescription')
								.setDescription(enLang.command.profile.newdescriptionDesc)
								.setMaxLength(descMax)
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand.setName('hud')
						.setDescription(enLang.command.profile.sethudDesc)
						.addStringOption(option =>
							option.setName('newhud')
								.setDescription(enLang.command.profile.newhudDesc)
								.setRequired(true)
						)
				)				
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member') || interaction.user;
		const refP = db.collection('perfis').doc(user.id);
		const refI = db.collection('inventario').doc(interaction.user.id);
		
		switch (interaction.options.getSubcommand()) {
			case 'check':
				refP.get().then(async doc => {
					if (!doc.exists) {
						if (user === interaction.user) {
							interaction.reply(lang.error.noProfile);
						}
						else if (user === bot.user) {
							interaction.reply(lang.botNoProfile);
						}
						else if (user.bot) {
							interaction.reply(lang.botsNoProfile);
						}
						else {
							interaction.reply(getText(lang.error.userHasNoProfile, [user.tag]));
						}
					}
					else {
						const nick = doc.get('nickname');
						const desc = doc.get('description');
						const bal = doc.get('balance');
						const hud = doc.get('hud');
						const xp = doc.get('xp');
		
						const level = Math.floor(Math.sqrt(xp / 2000000) * 99) + 1;
						const prevLevel = Math.round(Math.pow((level - 1) / 99, 2) * 2000000);
						const nextLevel = Math.round(Math.pow(level / 99, 2) * 2000000);
						let xpNeeded = nextLevel - prevLevel;
						let xpToNext = xp - prevLevel;
		
						if (xpNeeded <= 0) xpNeeded = 200;
						if (xpToNext <= 0) xpToNext = xp;
		
						const canvas = createCanvas(700, 400);
						const ctx = canvas.getContext('2d');
		
						const bg = await loadImage(`src/img/profile/hud (${hud}).png`);
						ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		
						ctx.beginPath();
		
						ctx.globalAlpha = 0.4;
						ctx.fillStyle = 'white';
						ctx.fillRect(175, 192, 465, 30);
						ctx.fill();
		
						ctx.globalAlpha = 0.7;
						ctx.fillStyle = (items as any).huds[hud].hex;
						ctx.fillRect(175, 192, 99 / xpNeeded * xpToNext * 4.25, 30);
						ctx.fill();
						ctx.globalAlpha = 1;
		
						ctx.save();
						ctx.font = '20px bold Comic Sans MS';
						ctx.shadowColor = 'black';
						ctx.shadowBlur = 0;
						ctx.shadowOffsetX = 1;
						ctx.shadowOffsetY = 1;
						ctx.fillStyle = 'white';
						ctx.textAlign = 'center';
						ctx.fillText(user.tag, 410, 65);
		
						ctx.font = '16px Comic Sans MS';
						ctx.fillText(`${nick}`, 410, 90);
		
						ctx.font = '18px Comic Sans MS';
						ctx.textAlign = 'left';
						ctx.fillText(`${lang.totalXP}: ${xp}`, 175, 140);
						ctx.fillText(`${lang.level}: ${level}`, 175, 175);
		
						ctx.fillStyle = 'gold';
						ctx.textAlign = 'right';
						ctx.fillText(`${lang.balance}: ¤${bal}`, 640, 155);
		
						ctx.font = '18px Comic Sans MS';
						ctx.fillStyle = 'white';
						ctx.textAlign = 'left';
						ctx.fillText(`${lang.description}:`, 175, 270);
						ctx.fillText(`${desc}`, 175, 320);
		
						ctx.font = '18px Comic Sans MS';
						ctx.textAlign = 'center';
						ctx.fillText(`${xpToNext} / ${convert(xpNeeded)}`, 410, 214);
						ctx.restore();
		
						ctx.closePath();
		
						const vip = (await db.collection('vip').doc(user.id).get()).data();
		
						ctx.beginPath();
						ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
						ctx.lineWidth = 6;
						ctx.strokeStyle = 'white';
						ctx.fillStyle = 'white';
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
		
						if (vip) {
							const crown = await loadImage('src/img/profile/crown.png');
							ctx.drawImage(crown, 7, 12, 50, 50);
						}
		
						const avatar = await loadImage(user.displayAvatarURL({ extension: 'png' }));
						ctx.clip();
						ctx.drawImage(avatar, 37, 10, 120, 120);
		
						const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile.png'});
		
						interaction.reply({ files: [attachment] });
					}
				});
				break;
			case 'create':
				db.collection('perfis').doc(interaction.user.id).get().then(doc => {
					if (doc.exists) {
						interaction.reply(lang.error.hasProfileAlready);
					}
					else {
						db.collection('perfis').doc(interaction.user.id).set({
							balance: 0,
							hud: 'Grey',
							description: 'N/A',
							lastDaily: 0,
							level: 0,
							name: user.tag,
							nickname: 'N/A',
							xp: 0
						});
						refI.set({
							huds: ['Grey'],
							items: [],
							petHuds: []
						}).then(() => {
							interaction.reply(getText(lang.command.profile.wasCreated, [lang.description]));
						});
					}
				});
				break;
			case 'nickname':
				const newNickname = interaction.options.getString('newnickname');
				db.collection('perfis').doc(interaction.user.id).get().then(doc => {
					if (!doc.exists) {
						if (user === interaction.user) {
							interaction.reply(lang.error.noProfile);
						}
					}
					else {
						db.collection('perfis').doc(interaction.user.id).update({
							nickname: newNickname
						}).then(() => {
							interaction.reply(getText(lang.command.profile.nicknameChangedTo, [newNickname]));
						});
					}
				});
				break;
			case 'description':
				const newDescription = interaction.options.getString('newdescription');
				db.collection('perfis').doc(interaction.user.id).get().then(doc => {
					if (!doc.exists) {
						if (user === interaction.user) {
							interaction.reply(lang.error.noProfile);
						}
					}
					else {
						db.collection('perfis').doc(interaction.user.id).update({
							description: newDescription
						}).then(() => {
							interaction.reply(getText(lang.command.profile.descChangedTo, [newDescription]));
						});
					}
				});
				break;
			case 'hud':
				db.collection('perfis').doc(interaction.user.id).get().then(docP => {
					if (!docP.exists) {
						if (user === interaction.user) {
							interaction.reply(lang.error.noProfile);
						}
					}
					else {
						refI.get().then(async docI => {
							const iHuds = docI.get('huds');
							let newHud = '';
		
							newHud = newHud.concat(interaction.options.getString('newhud').slice(0));
		
							if (!newHud) {
								interaction.reply(lang.error.noHUDChosen);
							}
							else if (!iHuds.includes(`${newHud}`) && interaction.user.id !== botConfig.botOwnerID && !botConfig.collaboratorIDs.includes(interaction.user.id)) {
								interaction.reply(lang.error.noHaveHUD);
							}
							else {
								try {
									await loadImage(`src/img/profile/hud (${newHud}).png`);
								}
								catch {
									interaction.reply(lang.error.noHUD);
								}
											
								db.collection('perfis').doc(interaction.user.id).update({
									hud: newHud
								}).then(() => {
									interaction.reply(getText(lang.command.profile.hudChangedTo, [interaction.options.getString('newhud')]));
								});
							}
						});
					}
				});
				break;
		}
	}
};