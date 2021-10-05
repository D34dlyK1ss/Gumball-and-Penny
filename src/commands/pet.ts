import { Message, MessageAttachment } from 'discord.js';
import { BotClient } from 'index';
import { registerFont, createCanvas, loadImage } from 'canvas';
import botConfig from '../../botConfig.json';
import titleCase from '../functions/titleCase';
import items from '../data/itemlist.json';
import getText from '../functions/getText';
registerFont('src/fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('src/fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('src/fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('src/fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export const name = 'pet';

export function execute(bot: BotClient, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const user = message.mentions.users.first() ?? message.author;
	const refV = db.collection('vip').doc(user.id);
	const refP = db.collection('pet').doc(user.id);
	const refI = db.collection('inventario').doc(message.author.id);
	const option = args[0];
	args = args.slice(1);
	const argsString = args.join(' ');

	switch (option) {
		case 'setname':
			db.collection('pet').doc(message.author.id).get().then(doc => {
				const pet = doc.get('pet');
				if (!doc.exists) {
					message.reply(`${lang.error.noPet}\`${prefix}shop\`!`);
				}
				else if ((items as any).pets[pet].vip) {
					message.reply(lang.error.noChangePetName);
				}
				else {
					const max = 25;

					refI.get().then(async docI => {
						const invItems = docI.get('items');
						const newName = titleCase(argsString);

						if (!invItems) {
							await refI.update({
								'items': []
							});
						}

						if (!invItems.includes('name_license')) {
							message.reply(lang.error.noNameLicense);
						}
						else if (!newName || newName === '') {
							message.reply(lang.error.noName);
						}
						else if (newName === doc.get('name')) {
							message.reply(lang.error.petAlreadyHasName);
						}
						else if (argsString.length > max) {
							message.reply(getText(lang.pet.nameMaxIs, [max, argsString.length]));
						}
						else {
							invItems.splice(invItems.findIndex((item: string) => item === 'name_license'), 1);
							refI.update({
								items: invItems
							});

							db.collection('pet').doc(message.author.id).update({
								name: newName
							}).then(() => {
								message.reply(getText(lang.pet.nameChangedTo, [newName]));
							});
						}
					});
				}
			});
			break;
		case 'sethud':
			db.collection('pet').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user === message.author) {
						message.reply(`${lang.error.noPet}\`${prefix}shop\`!`);
					}
				}
				else {
					refI.get().then(docI => {
						const petHuds = docI.get('petHuds');
						let newHud = '';

						newHud = newHud.concat(argsString.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud === '') {
							message.reply(lang.error.noPetHudChosen);
						}
						else if (!petHuds.includes(`${newHud}`) && message.author.id !== botConfig.botOwnerID && !botConfig.collaboratorIDs.includes(message.author.id)) {
							message.reply(lang.error.noHavePetHud);
						}
						else {
							db.collection('pet').doc(message.author.id).update({
								hud: newHud
							}).then(() => {
								message.reply(getText(lang.pet.petHudChangedTo, [titleCase(argsString)]));
							});
						}
					});
				}
			});
			break;
		case 'sendtoadoption':
			db.collection('pet').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user === message.author) {
						message.reply(lang.error.noPetToAdoption);
					}
				}
				else {
					let petName = docP.get('name');
					const pet = docP.get('pet');
					db.collection('pet').doc(message.author.id).delete().then(() => {
						refI.get().then(docI => {
							const iPetHuds = docI.get('petHuds');
							if (iPetHuds.includes(pet)) iPetHuds.splice(iPetHuds.findIndex((petHud: string) => petHud === pet), 1);
						});
						if (petName === 'N/A') petName = `${docP.get('species').toLowerCase()}`;
						message.reply(getText(lang.pet.wasSentToAdoption, [petName]));
					});
				}
			});
			break;
		default:
			refP.get().then(async doc => {
				if (!doc.exists) {
					if (user === message.author) {
						message.reply(`${lang.error.noPet}\`${prefix}shop\`!`);
					}
					else if (user === bot.user) {
						message.reply(lang.pet.botNoPet);
					}
					else if (user.bot) {
						message.reply(lang.pet.botsNoPets);
					}
					else {
						message.reply(`**${user.tag}**${lang.error.userNoPet}`);
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

					const bg = await loadImage(`src/img/pet/hud_pet (${petHud}).png`);
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
					ctx.stroke();
					ctx.closePath();

					refV.get().then(async docV => {

						if (docV.exists) {
							const crown = await loadImage('src/img/profile/crown.png');
							ctx.drawImage(crown, 7, 12, 50, 50);
						}

						const avatar = await loadImage(user.displayAvatarURL({ format: 'png' }));
						ctx.clip();
						ctx.drawImage(avatar, 37, 10, 120, 120);

						const attachment = new MessageAttachment(canvas.toBuffer(), 'pet.png');

						await message.channel.send({ files: [attachment] });
					});
				}
			});
			break;
	}
}