const { MessageAttachment } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas');
const items = require('../src/data/itemlist.json'),
	titleCase = require('../src/functions/titleCase.js');
registerFont('./fonts/comic.ttf', { family: 'Comic Sans MS' });
registerFont('./fonts/comicb.ttf', { family: 'bold Comic Sans MS' });
registerFont('./fonts/comici.ttf', { family: 'italic Comic Sans MS' });
registerFont('./fonts/comicz.ttf', { family: 'bold-italic Sans MS' });

module.exports = {
	name: 'pet',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		const user = message.mentions.users.first() || message.author,
			refV = db.collection('vip').doc(user.id),
			refP = db.collection('pet').doc(user.id),
			refI = db.collection('inventario').doc(message.author.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'setname':
			db.collection('pet').doc(message.author.id).get().then(doc => {
				const pet = doc.get('pet');
				if (!doc.exists) {
					return message.reply(`${lang.error.noPet}\`${prefix}shop pets\`!`).catch();
				}
				else if (items.pets[pet].vip) {
					return message.reply(lang.error.noChangePetName).catch();
				}
				else {
					const max = 25;

					refI.get().then(docI => {
						const invItems = docI.get('items'),
							newName = titleCase(args);

						if (!invItems) {
							refI.update({
								'items': [],
							});
						}

						if (!invItems.includes('name_license')) {
							return message.reply(lang.error.noNameLicense).catch();
						}
						else if (!newName || newName == '') {
							return message.reply(lang.error.noName).catch();
						}
						else if (newName == doc.get('name')) {
							return message.reply(lang.error.petAlreadyHasName).catch();
						}
						else if (args.length > max) {
							return message.reply(`${lang.pet.nameMaxIs + max}!\n${lang.pet.nameHas + args.length}.`).catch();
						}
						else {
							invItems.splice(invItems.findIndex(item => item == 'name_license'), 1);
							refI.update({
								items: invItems,
							});

							db.collection('pet').doc(message.author.id).update({
								name: newName,
							}).then(() => {
								message.reply(`${lang.pet.nameChangedTo}**${newName}**!`).catch();
							}).catch(err => { console.error(err); });
						}
					});
				}
			});
			break;
		case 'sethud':
			db.collection('pet').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user == message.author) {
						return message.reply(`${lang.error.noPet}\`${prefix}shop pets\`!`).catch();
					}
				}
				else {
					refI.get().then(docI => {
						const petHuds = docI.get('petHuds');
						let newHud = '';

						newHud = newHud.concat(args.slice(0)).toLowerCase().replace(/[ ]/g, '_');

						if (!newHud || newHud == '') {
							return message.reply(lang.error.noPetHUDChosen).catch();
						}
						else if (!petHuds.includes(`${newHud}`)) {
							return message.reply(lang.error.noHavePetHUD).catch();
						}
						else {
							db.collection('pet').doc(message.author.id).update({
								hud: newHud,
							}).then(() => {
								message.reply(`${lang.pet.petHUDChangedTo}**${titleCase(args)}**`).catch();
							}).catch(err => { console.error(err); });
						}
					});
				}
			});
			break;
		case 'sendtoadoption':
			db.collection('pet').doc(message.author.id).get().then(docP => {
				if (!docP.exists) {
					if (user == message.author) {
						return message.reply(lang.error.noPetToAdoption).catch();
					}
				}
				else {
					let petName = docP.get('name');
					const pet = docP.get('pet');
					db.collection('pet').doc(message.author.id).delete().then(async () => {
						refI.get().then(docI => {
							const iPetHUDs = docI.get('petHuds');
							if (iPetHUDs.includes(pet)) iPetHUDs.splice(iPetHUDs.findIndex(petHud => petHud === pet), 1);
						});
						if (petName == '') petName = `${(docP.get('species')).toLowerCase()}`;
						message.reply(`**${petName}**${lang.pet.wasSentToAdoption}`).catch();
					});
				}
			});
			break;
		default:
			refP.get().then(async doc => {
				if (!doc.exists) {
					if (user == message.author) {
						return message.reply(`${lang.error.noPet}\`${prefix}shop pets\`!`).catch();
					}
					else if (user == bot.user) {
						return message.reply(lang.pet.botNoPet).catch();
					}
					else if (user.bot) {
						return message.reply(lang.pet.botsNoPets).catch();
					}
					else {
						return message.reply(`${user.tag}${lang.error.userNoPet}`).catch();
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
					ctx.drawImage (petPic, 160, 120);

					ctx.beginPath();
					ctx.arc(97, 70, 58, 0, Math.PI * 2, true);
					ctx.lineWidth = 6;
					ctx.strokeStyle = 'white';
					ctx.stroke();
					ctx.closePath();

					refV.get().then(async docV => {

						if (docV.exists) {
							const crown = await loadImage('./img/profile/crown.png');
							ctx.drawImage (crown, 7, 12, 50, 50);
						}

						const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
						ctx.clip();
						ctx.drawImage (avatar, 37, 10, 120, 120);

						const attachment = new MessageAttachment(canvas.toBuffer(), 'pet.png');

						await message.channel.send(attachment).catch();
					});
				}
			});
			break;
		}
	},
};