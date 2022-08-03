import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import botConfig from '../../botConfig.json';
import items from '../data/itemlist.json';
import getText from '../functions/getText';
import enLang from '../lang/en.json';
GlobalFonts.registerFromPath('src/fonts/comic.ttf', 'Comic Sans MS');
GlobalFonts.registerFromPath('src/fonts/comicb.ttf', 'Comic Sans MS Bold');
GlobalFonts.registerFromPath('src/fonts/comici.ttf', 'Comic Sans MS Italic');
GlobalFonts.registerFromPath('src/fonts/comicz.ttf', 'Comic Sans MS Bold Italic');

const nameMax = 25;

export = {
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription(enLang.command.pet.description)
		.addSubcommand(subcommand =>
			subcommand.setName('check')
				.setDescription(enLang.command.pet.checkDesc)
				.addUserOption(option =>
					option.setName('member')
						.setDescription(enLang.command.pet.memberDesc)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('setname')
				.setDescription(enLang.command.pet.setnameDesc)
				.addStringOption(option =>
					option.setName('newname')
						.setDescription(enLang.command.pet.newNameDesc)
						.setMaxLength(nameMax)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('sethud')
				.setDescription(enLang.command.pet.sethudDesc)
				.addStringOption(option =>
					option.setName('newhud')
						.setDescription(enLang.command.pet.newHudDesc)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('sendtoadoption')
				.setDescription(enLang.command.pet.sendtoadoptionDesc)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const user = interaction.options.getUser('member') || interaction.user;
		const refV = db.collection('vip').doc(user.id);
		const refP = db.collection('pet').doc(user.id);
		const refI = db.collection('inventario').doc(interaction.user.id);
		
		switch (interaction.options.getSubcommand()) {
			case 'check':
				refP.get().then(async doc => {
					if (!doc.exists) {
						if (user === interaction.user) {
							interaction.reply(lang.error.noPet);
						}
						else if (user === bot.user) {
							interaction.reply(lang.command.pet.botNoPet);
						}
						else if (user.bot) {
							interaction.reply(lang.command.pet.botsNoPets);
						}
						else {
							interaction.reply(`**${user.tag}**${lang.error.userNoPet}`);
						}
					}
					else {
						const pet = doc.get('pet');
						const petName = doc.get('name');
						const petSpecies = doc.get('species');
						const petGender = doc.get('gender');
						const petNature = doc.get('nature');
						const petHud = doc.get('hud');
		
						const canvas = createCanvas(617, 327);
						const ctx = canvas.getContext('2d');
		
						const bg = await loadImage(`src/img/pet/petHud (${petHud}).png`);
						ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		
						ctx.beginPath();
		
						ctx.globalAlpha = 0.3;
						ctx.fillStyle = 'black';
						ctx.fillRect(324, 102, 220, 176);
						ctx.fill();
		
						ctx.globalAlpha = 1;
		
						ctx.save();
		
						ctx.font = '18px Comic Sans MS';
						ctx.shadowColor = 'black';
						ctx.shadowBlur = 0;
						ctx.shadowOffsetX = 1;
						ctx.shadowOffsetY = 1;
						ctx.fillStyle = 'white';
		
						const extra = 40;
						ctx.fillText(`${lang.name}: ${petName}`, 330, 105 + extra);
						ctx.fillText(`${lang.species}: ${lang.pets.species[petSpecies]}`, 330, 135 + extra);
						ctx.fillText(`${lang.gender}: ${petGender}`, 330, 165 + extra);
						ctx.fillText(`${lang.nature}: ${lang.pets.natures[petNature]}`, 330, 195 + extra);
		
						ctx.restore();
						ctx.closePath();
		
						const petPic = await loadImage(`src/img/pet/${pet}.png`);
						ctx.drawImage(petPic, 160, 120);
		
						ctx.beginPath();
						ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
						ctx.lineWidth = 6;
						ctx.strokeStyle = 'white';
						ctx.fillStyle = 'white';
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
		
						refV.get().then(async docV => {
		
							if (docV.exists) {
								const crown = await loadImage('src/img/profile/crown.png');
								ctx.drawImage(crown, 7, 12, 50, 50);
							}
		
							const avatar = await loadImage(user.displayAvatarURL({ extension: 'png' }));
							ctx.clip();
							ctx.drawImage(avatar, 37, 10, 120, 120);
		
							const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name:'pet.png' });
		
							await interaction.reply({ files: [attachment] });
						});
					}
				});
				break;
			case 'setname':
				db.collection('pet').doc(interaction.user.id).get().then(doc => {
					const pet = doc.get('pet');
					if (!doc.exists) {
						interaction.reply(lang.error.noPet);
					}
					else if ((items as any).pets[pet].vip) {
						interaction.reply(lang.error.noChangePetName);
					}
					else {
						refI.get().then(async docI => {
							const invItems = docI.get('items');
							const newName = interaction.options.getString('newname');
		
							if (!invItems) {
								await refI.update({
									'items': []
								});
							}
		
							if (!invItems.includes('name_license')) {
								interaction.reply(lang.error.noNameLicense);
							}
							else if (!newName) {
								interaction.reply(lang.error.noName);
							}
							else if (newName === doc.get('name')) {
								interaction.reply(lang.error.petAlreadyHasName);
							}
							else {
								invItems.splice(invItems.findIndex((item: string) => item === 'name_license'), 1);
								refI.update({
									items: invItems
								});
		
								db.collection('pet').doc(interaction.user.id).update({
									name: newName
								}).then(() => {
									interaction.reply(getText(lang.command.pet.nameChangedTo, [newName]));
								});
							}
						});
					}
				});
				break;
			case 'sethud':
				db.collection('pet').doc(interaction.user.id).get().then(docP => {
					if (!docP.exists) {
						interaction.reply(lang.error.noPet);
					}
					else {
						refI.get().then(docI => {
							const petHuds = docI.get('petHuds');
							let newHud = '';
		
							newHud = newHud.concat(interaction.options.getString('newhud').slice(0));
		
							if (!newHud) {
								interaction.reply(lang.error.noPetHudChosen);
							}
							else if (!petHuds.includes(`${newHud}`) && interaction.user.id !== botConfig.botOwnerID && !botConfig.collaboratorIDs.includes(interaction.user.id)) {
								interaction.reply(lang.error.noHavePetHud);
							}
							else {
								db.collection('pet').doc(interaction.user.id).update({
									hud: newHud
								}).then(() => {
									interaction.reply(getText(lang.command.pet.petHudChangedTo, [interaction.options.getString('newhud')]));
								});
							}
						});
					}
				});
				break;
			case 'sendtoadoption':
				db.collection('pet').doc(interaction.user.id).get().then(docP => {
					if (!docP.exists) {
						interaction.reply(lang.error.noPetToAdoption);
					}
					else {
						let petName = docP.get('name');
						const pet = docP.get('pet');
						db.collection('pet').doc(interaction.user.id).delete().then(() => {
							refI.get().then(docI => {
								const iPetHuds = docI.get('petHuds');
								if (iPetHuds.includes(pet)) iPetHuds.splice(iPetHuds.findIndex((petHud: string) => petHud === pet), 1);
							});
							if (petName === 'N/A') petName = `${docP.get('species')}`;
							interaction.reply(getText(lang.command.pet.wasSentToAdoption, [petName]));
						});
					}
				});
				break;
		}
	}
};