import { Message, MessageAttachment } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import * as items from '../src/data/itemlist.json';
import * as natures from '../src/data/natures.json';
import slugify from '../src/functions/slugify';
import titleCase from '../src/functions/titleCase';
import { createShopPage } from '../src/functions/shopHandler';

export const name = 'shop';
export const naliases = ['s'];
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, any>, language: undefined, prefix: string, args: string[]) {
	async function sendPreview(hudName: string) {
		const hudCanvas = createCanvas(700, 400);
		const ctx = hudCanvas.getContext('2d');

		try {
			const bg = await loadImage(`img/profile/hud (${hudName}).png`);
			const watermark = await loadImage('img/hud_watermark.png');
			ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
			ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

			const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${hudName}_preview.png`);

			message.channel.send({ files: [attachment] }).catch(err => { console.error(err); });
		}
		catch {
			return message.reply(lang.error.noHUD).catch(err => { console.error(err); });
		}

	}

	async function sendPreviewPet(petHudName: string) {
		const hudCanvas = createCanvas(617, 327);
		const ctx = hudCanvas.getContext('2d');
		try {
			const bg = await loadImage(`img/pet/hud_pet (${petHudName}).png`);
			const watermark = await loadImage('img/hud_watermark.png');
			ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
			ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

			const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${petHudName}_preview.png`);

			message.channel.send({ files: [attachment] }).catch(err => { console.error(err); });
		}
		catch {
			return message.reply(lang.error.noPetHUD).catch(err => { console.error(err); });
		}
	}

	const option = args[0];
	const refP = db.collection('perfis').doc(message.author.id);
	const refV = db.collection('vip').doc(message.author.id);
	const refPet = db.collection('pet').doc(message.author.id);
	const refI = db.collection('inventario').doc(message.author.id);

	let hud = '';
	let petHud = '';
	let item = '';
	let pet = '';
	const colors = ['black', 'blue', 'brown', 'green', 'grey', 'orange', 'pink', 'purple', 'red', 'yellow'];

	switch (option) {
		case 'buy':
			switch (args[1]) {
				case 'hud':
					hud = slugify(hud.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_'));

					refP.get().then((docP: any) => {
						if (!docP.exists) {
							message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
						}
						else {
							const bal = docP.get('balance');
							let hudName = hud.toLowerCase();
							let hudCost: number;

							colors.includes(hudName) ? hudCost = items.huds.colorPrice : hudCost = items.huds.price;

							if (!(items as any).huds[hudName]) {
								message.reply(lang.error.noHUD).catch(err => { console.error(err); });
							}
							else {
								refI.get().then((docI: any) => {
									const iHuds = docI.get('huds');

									if (iHuds.includes(hudName)) {
										message.reply(lang.error.alreadyHasHUD).catch(err => { console.error(err); });
									}
									else if (hudCost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										iHuds.push(hudName);

										refP.update({
											balance: (bal - hudCost)
										});

										refI.update({
											huds: iHuds
										}).then(() => {
											hudName = hudName.toLowerCase().replace(/[_]/g, ' ');
											message.reply(`${lang.shop.boughtHUD}**${titleCase(hudName)}**! ${lang.shop.toEquip}\`${prefix}profile sethud[${lang.shop.hudName}]\``).catch(err => { console.error(err); });
										});
									}
								});
							}
						}
					});
					break;
				case 'pethud':
					petHud = slugify(petHud.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_'));

					refP.get().then((docP: any) => {
						if (!docP.exists) {
							message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
						}
						else {
							const bal = docP.get('balance');
							let petHudName = petHud.toLowerCase();
							const userVIP = refV.get();
							let petHudCost: number;

							colors.includes(petHudName) ? petHudCost = items.petHuds.price : petHudCost = items.petHuds.vipPrice;
							
							if (!(items as any).petHuds[petHudName]) {
								message.reply(lang.error.noPetHUD).catch(err => { console.error(err); });
							}
							else if (!userVIP && (items as any).petHuds[petHudName].vip) {
								message.reply(lang.error.noVIPForPetHUD).catch(err => { console.error(err); });
							}
							else {
								refI.get().then((docI: any) => {
									const iPetHUDs = docI.get('petHuds');

									if (iPetHUDs.includes(petHudName)) {
										message.reply(lang.error.alreadyHasPetHUD).catch(err => { console.error(err); });
									}
									else if (petHudCost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										iPetHUDs.push(petHudName);

										refI.update({
											petHuds: iPetHUDs
										}, { merge: true }).then(() => {
											refP.update({
												balance: (bal - petHudCost)
											});

											petHudName = petHudName.toLowerCase().replace(/[_]/g, ' ');

											message.reply(`${lang.shop.boughtPetHUD}**${titleCase(petHudName)}**! ${lang.shop.toEquip}\`${prefix}pet sethud[${lang.shop.hudName}]\``).catch(err => { console.error(err); });
										});
									}
								});
							}
						}
					});
					break;
				case 'item':
					item = slugify(item.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_'));

					refP.get().then((docP: any) => {
						if (!docP.exists) {
							message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
						}
						else {
							const bal = docP.get('balance');
							let itemName = item.toLowerCase();
							const itemCost = (items as any).items[itemName].price;

							if (!(items as any).items[itemName]) {
								message.reply(lang.error.noItem).catch(err => { console.error(err); });
							}
							else {
								refI.get().then((docI: any) => {
									const iItems = docI.get('items') || [];

									if (itemCost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										iItems.push(itemName);

										refI.update({
											items: iItems
										}, { merge: true }).then(() => {
											refP.update({
												balance: (bal - itemCost)
											});

											itemName = itemName.toLowerCase().replace(/[_]/g, ' ');

											message.reply(`${lang.shop.boughtItem}**${titleCase(itemName)}**!`).catch(err => { console.error(err); });
										});
									}
								});
							}
						}
					});
					break;
				case 'pet':
					pet = slugify(pet.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_'));
					refPet.get().then((docPet: any) => {
						if (docPet.exists) {
							message.reply(`${lang.error.alreadyHasPet}\`${prefix}sendtoadoption\`!`).catch(err => { console.error(err); });
						}
						else {
							let petName = pet.toLowerCase();
							const petCost = (items.pets as any)[petName].price;

							if (!(items as any).pets[petName]) {
								message.reply(lang.error.noItem).catch(err => { console.error(err); });
							}
							else {
								refP.get().then((docP: any) => {
									const bal = docP.get('balance');
									if (petCost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										const rndN = Math.floor(Math.random() * 12);
										const rndG = Math.random();
										const vipPet = (items.pets as any)[pet].vip;
										const userVIP = refV.get();
										const species = (items.pets as any)[pet].species;
										let gender = (items.pets as any)[pet].gender;

										if (!userVIP && vipPet) {
											message.reply(lang.error.noVIPForPet).catch(err => { console.error(err); });
										}
										else {
											if (gender === 'random') rndG < 0.5 ? gender = '♂️' : gender = '♀️';
											vipPet ? petName = `${(items.pets as any)[pet].name}` : petName = 'N/A';

											refPet.set({
												gender: `${gender}`,
												hud: 'grey',
												name: petName,
												nature: (natures as any)[gender][rndN],
												pet: pet ,
												species: titleCase(species)
											}).then(() => {
												refI.get().then((docI: any) => {
													const iPetHuds = docI.get('petHuds');
													if (!iPetHuds) {
														refI.update({
															'petHuds': ['grey']
														});
													}

													if (vip) {
														iPetHuds.push(pet);
														refI.update({
															petHuds: iPetHuds
														});
													}
												});

												refP.update({
													balance: (bal - petCost)
												});

												petName = species.toLowerCase().replace(/[_]/g, ' ');
												const vip = (items.pets as any)[pet].vip;

												if (vip) petName = name;
												message.reply(`${lang.youBought}**${titleCase(petName)}**! ${lang.shop.toGiveName} \`${prefix}pet setname [${lang.shop.name}]\``).catch(err => { console.error(err); });
											});
										}
									}
								});
							}
						}
					});
					break;
			}
			break;
		case 'view':
			switch (args[1]) {
				case 'hud': {
					const hudName = hud.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_');

					sendPreview(hudName);
					break;
				}
				case 'pethud': {
					const petHudName = petHud.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_');

					sendPreviewPet(petHudName);
					break;
				}
			}
			break;
		default: {
			const pageToSend: any = createShopPage(message.member.id, lang, prefix, 'shopmainEmbed0');

			message.reply({ embeds: [pageToSend[0]], components: [pageToSend[1]] }).catch(err => { console.error(err); });
			break;
		}
	}
}