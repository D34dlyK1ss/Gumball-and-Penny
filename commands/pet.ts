import { Client, Message, MessageAttachment } from 'discord.js';
import { registerFont, createCanvas, loadImage } from 'canvas';
import config from '../botConfig.json';
import titleCase from '../src/functions/titleCase';
import items from '../src/data/itemlist.json';
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

export const name = 'pet';

export function execute(bot: Client, message: Message, command: undefined, db: any, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	const user = message.mentions.users.first() || message.author,
		refV = db.collection('vip').doc(user.id),
		refP = db.collection('pet').doc(user.id),
		refI = db.collection('inventario').doc(message.author.id),
		option = args[0];
	args = args.slice(1);
	const argsString = args.join(' ');

	switch (option) {
		case 'setname':
			db.collection('pet').doc(message.author.id).get().then((doc: any) => {
				const pet = doc.get('pet');
				if (!doc.exists) {
					message.reply(`${lang.error.noPet}\`${prefix}shop pets\`!`).catch(err => { console.error(err); });
				}
				else if ((items as any).pets[pet].vip) {
					message.reply(lang.error.noChangePetName).catch(err => { console.error(err); });
				}
				else {
					const max = 25;

					refI.get().then(async (docI: any) => {
						const invItems = docI.get('items'),
							newName = titleCase(argsString);

						if (!invItems) {
							await refI.update({
								'items': [],
							});
						}

						if (!invItems.includes('name_license')) {
							message.reply(lang.error.noNameLicense).catch(err => { console.error(err); });
						}
						else if (!newName || newName == '') {
							message.reply(lang.error.noName).catch(err => { console.error(err); });
						}
						else if (newName == doc.get('name')) {
							message.reply(lang.error.petAlreadyHasName).catch(err => { console.error(err); });
						}
						else if (argsString.length > max) {
							message.reply(`${lang.pet.nameMaxIs + max}!\n${lang.pet.nameHas + argsString.length}.`).catch(err => { console.error(err); });
						}
						else {
							invItems.splice(invItems.findIndex((item: string) => item === 'name_license'), 1);
							refI.update({
								items: invItems,
							});

							db.collection('pet').doc(message.author.id).update({
								name: newName,
							}).then(() => {
								message.reply(`${lang.pet.nameChangedTo}**${newName}**!`).catch(err => { console.error(err); });
							}).catch((err: Error) => { console.error(err); });
						}
					});
				}
			});
			break;
		case 'sethud':
			db.collection('pet').doc(message.author.id).get().then((docP: any) => {
				if (!docP.exists) {
					if (user == message.author) {
						message.reply(`${lang.error.noPet}\`${prefix}shop pets\`!`).catch(err => { console.error(err); });
					}
				}
				else {
					refI.get().then((docI: any) => {
						const petHuds = docI.get('petHuds');
						let newHud = '';

						newHud = newHud.concat(argsString.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud == '') {
							message.reply(lang.error.noPetHUDChosen).catch(err => { console.error(err); });
						}
						else if (!petHuds.includes(`${newHud}`) && message.author.id !== config.botOwner && message.author.id !== config.lilly) {
							message.reply(lang.error.noHavePetHUD).catch(err => { console.error(err); });
						}
						else {
							db.collection('pet').doc(message.author.id).update({
								hud: newHud,
							}).then(() => {
								message.reply(`${lang.pet.petHUDChangedTo}**${titleCase(argsString)}**`).catch(err => { console.error(err); });
							}).catch((err: Error) => { console.error(err); });
						}
					});
				}
			});
			break;
		case 'sendtoadoption':
			db.collection('pet').doc(message.author.id).get().then((docP: any) => {
				if (!docP.exists) {
					if (user == message.author) {
						message.reply(lang.error.noPetToAdoption).catch(err => { console.error(err); });
					}
				}
				else {
					let petName = docP.get('name');
					const pet = docP.get('pet');
					db.collection('pet').doc(message.author.id).delete().then(async () => {
						refI.get().then((docI: any) => {
							const iPetHUDs = docI.get('petHuds');
							if (iPetHUDs.includes(pet)) iPetHUDs.splice(iPetHUDs.findIndex((petHud: string) => petHud === pet), 1);
						});
						if (petName == '') petName = `${(docP.get('species')).toLowerCase()}`;
						message.reply(`**${petName}**${lang.pet.wasSentToAdoption}`).catch(err => { console.error(err); });
					});
				}
			});
			break;
		default:
			refP.get().then(async (doc: any) => {
				if (!doc.exists) {
					if (user == message.author) {
						message.reply(`${lang.error.noPet}\`${prefix}shop pets\`!`).catch(err => { console.error(err); });
					}
					else if (user == bot.user) {
						message.reply(lang.pet.botNoPet).catch(err => { console.error(err); });
					}
					else if (user.bot) {
						message.reply(lang.pet.botsNoPets).catch(err => { console.error(err); });
					}
					else {
						message.reply(`${user.tag}${lang.error.userNoPet}`).catch(err => { console.error(err); });
					}
				}
				else {
					const pet = doc.get('pet'),
						petName = doc.get('name'),
						petSpecies = doc.get('species'),
						petGender = doc.get('gender'),
						petNature = doc.get('nature'),
						petHud = doc.get('hud');

					const canvas = createCanvas(617, 327),
						ctx = canvas.getContext('2d');

					const bg = await loadImage(`img/pet/hud_pet (${petHud}).png`);
					ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

					ctx.beginPath();

					ctx.globalAlpha = 1;

					ctx.save();

					ctx.font = '18px Comic Sans MS';
					ctx.shadowColor = 'black';
					ctx.shadowBlur = 3;
					ctx.shadowOffsetX = 3;
					ctx.shadowOffsetY = 3;
					ctx.fillStyle = 'white';

					const extra = 40;
					ctx.fillText(`${lang.name}: ${petName}`, 330, 105 + extra);
					ctx.fillText(`${lang.species}: ${lang.pets.species[petSpecies]}`, 330, 135 + extra);
					ctx.fillText(`${lang.gender}: ${petGender}`, 330, 165 + extra);
					ctx.fillText(`${lang.nature}: ${lang.pets.natures[petNature]}`, 330, 195 + extra);

					ctx.restore();
					ctx.closePath();

					const petPic = await loadImage(`./img/pet/${pet}.png`);
					ctx.drawImage(petPic, 160, 120);

					ctx.beginPath();
					ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
					ctx.lineWidth = 6;
					ctx.strokeStyle = 'white';
					ctx.stroke();
					ctx.closePath();

					refV.get().then(async (docV: any) => {

						if (docV.exists) {
							const crown = await loadImage('./img/profile/crown.png');
							ctx.drawImage(crown, 7, 12, 50, 50);
						}

						const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
						ctx.clip();
						ctx.drawImage(avatar, 37, 10, 120, 120);

						const attachment = new MessageAttachment(canvas.toBuffer(), 'pet.png');

						await message.channel.send(attachment).catch(err => { console.error(err); });
					});
				}
			});
			break;
	}
};