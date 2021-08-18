import { Client, Message, MessageAttachment, MessageEmbed, MessageActionRow } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import * as items from '../src/data/itemlist.json';
import * as natures from '../src/data/natures.json';
import slugify from '../src/functions/slugify';
import titleCase from '../src/functions/titleCase';
import { createShopPage } from '../src/functions/shopHandler';

export const name = 'shop';
export const naliases = ['s'];
export function execute(bot: Client, message: Message, command: undefined, db: any, lang: Record<string, any>, language: undefined, prefix: string, args: string[]) {
	async function sendPreview(hud: string) {
		const hudCanvas = createCanvas(700, 400),
			ctx = hudCanvas.getContext('2d');

		try {
			const bg = await loadImage(`img/profile/hud (${hud}).png`);
			const watermark = await loadImage('img/hud_watermark.png');
			ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
			ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

			const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${hud}_preview.png`);

			message.channel.send({ files: [attachment] }).catch(err => { console.error(err); });
		}
		catch {
			return message.reply(lang.error.noHUD).catch(err => { console.error(err); });
		}

	}

	async function sendPreviewPet(petHud: string) {
		const hudCanvas = createCanvas(617, 327),
			ctx = hudCanvas.getContext('2d');
		try {
			const bg = await loadImage(`img/pet/hud_pet (${petHud}).png`);
			const watermark = await loadImage('img/hud_watermark.png');
			ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
			ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

			const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${petHud}_preview.png`);

			message.channel.send({ files: [attachment] }).catch(err => { console.error(err); });
		}
		catch {
			return message.reply(lang.error.noPetHUD).catch(err => { console.error(err); });
		}
	}

	const option = args[0],
		refP = db.collection('perfis').doc(message.author.id),
		refPet = db.collection('pet').doc(message.author.id),
		refI = db.collection('inventario').doc(message.author.id);

	let cost: number, hud = '', petHud = '', item = '', pet = '', pageToSend: any;
	let colors = ['black', 'blue', 'brown', 'green', 'grey', 'orange', 'pink', 'purple', 'red', 'yellow'];

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
							const bal = docP.get('balance'),
								itemName = hud.toLowerCase();

							colors.includes(itemName) ? cost = (items as any).colorPrice : cost = (items as any).price;

							if (!cost) {
								message.reply(lang.error.noHUD).catch(err => { console.error(err); });
							}
							else {
								refI.get().then((docI: any) => {
									const iHuds = docI.get('huds');

									if (iHuds.includes(itemName)) {
										message.reply(lang.error.alreadyHasHUD).catch(err => { console.error(err); });
									}
									else if (cost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										iHuds.push(itemName);

										refP.update({
											balance: (bal - cost),
										});

										refI.update({
											huds: iHuds,
										}).then(() => {
											const name = itemName.toLowerCase().replace(/[_]/g, ' ');
											message.reply(`${lang.shop.boughtHUD}**${titleCase(name)}**! ${lang.shop.toEquip}\`${prefix}profile sethud\``).catch(err => { console.error(err); });
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
							const bal = docP.get('balance'),
								itemName = petHud.toLowerCase(),
								vipPetHUD = (items.petHuds as any)[itemName].vip;
							const userVIP = docP.get('vip');

							colors.includes(itemName) ? cost = (items as any).price : cost = (items as any).vipPrice;

							if (!userVIP && vipPetHUD) {
								message.reply(lang.error.noVIPForPetHUD).catch(err => { console.error(err); });
							}
							else if (!cost) {
								message.reply(lang.error.noPetHUD).catch(err => { console.error(err); });
							}
							else {
								refI.get().then((docI: any) => {
									const iPetHUDs = docI.get('petHuds');

									if (iPetHUDs.includes(itemName)) {
										message.reply(lang.error.alreadyHasPetHUD).catch(err => { console.error(err); });
									}
									else if (cost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										iPetHUDs.push(itemName);

										refI.update({
											petHuds: iPetHUDs,
										}).then(() => {
											refP.update({
												balance: (bal - cost),
											});

											const name = itemName.toLowerCase().replace(/[_]/g, ' ');

											message.reply(`${lang.shop.boughtPetHUD}**${titleCase(name)}**! ${lang.shop.toEquip}\`${prefix}pet sethud\``).catch(err => { console.error(err); });
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
							const bal = docP.get('balance'),
								itemName = item.toLowerCase(),
								cost = (items.items as any)[itemName].price;

							if (!cost) {
								message.reply(lang.error.noItem).catch(err => { console.error(err); });
							}
							else {
								refI.get().then((docI: any) => {
									const iItems = docI.get('items') || [];

									if (cost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										iItems.push(itemName);

										refI.update({
											items: iItems,
										}).then(() => {
											refP.update({
												balance: (bal - cost),
											});

											const name = itemName.toLowerCase().replace(/[_]/g, ' ');

											message.reply(`${lang.shop.boughtItem}**${titleCase(name)}**!`).catch(err => { console.error(err); });
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
							const itemName = pet.toLowerCase();
							const cost = (items.pets as any)[itemName].price;

							if (!cost) {
								message.reply(lang.error.noItem).catch(err => { console.error(err); });
							}
							else {
								refP.get().then((docP: any) => {
									const bal = docP.get('balance');
									if (cost > bal) {
										message.reply(lang.error.noMoney).catch(err => { console.error(err); });
									}
									else {
										const rndN = Math.floor(Math.random() * 12),
											rndG = Math.random(),
											vipPet = (items.pets as any)[pet].vip,
											userVIP = docP.get('vip'),
											species = (items.pets as any)[pet].species;
										let gender = (items.pets as any)[pet].gender,
											name: string;

										if (!userVIP && vipPet) {
											message.reply(lang.error.noVIPForPet).catch(err => { console.error(err); });
										}
										else {
											if (gender == 'random') rndG < 0.5 ? gender = '♂️' : gender = '♀️';
											vipPet ? name = `${(items.pets as any)[pet].name}` : name = 'N/A';

											refPet.set({
												gender: `${gender}`,
												hud: 'grey',
												name: name,
												nature: (natures as any)[gender][rndN],
												pet: pet,
												species: titleCase(species),
											}).then(() => {
												refI.get().then((docI: any) => {
													const iPetHuds = docI.get('petHuds');
													if (!iPetHuds) {
														refI.update({
															'petHuds': ['grey'],
														});
													}

													if (vip) {
														iPetHuds.push(pet);
														refI.update({
															petHuds: iPetHuds,
														});
													}
												});

												refP.update({
													balance: (bal - cost),
												});

												let petName = species.toLowerCase().replace(/[_]/g, ' ');
												const vip = (items.pets as any)[pet].vip;

												if (vip) petName = name;
												message.reply(`${lang.youBought}**${titleCase(petName)}**!`).catch(err => { console.error(err); });
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
				case 'hud':
					hud = hud.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_');
					sendPreview(hud);
					break;
				case 'pethud':
					petHud = petHud.concat((args as any).slice(2)).toLowerCase().replace(/[,]/g, '_');
					sendPreviewPet(petHud);
					break;
			}
			break;
		default:
			pageToSend = createShopPage(message.author, lang, prefix, 'mainEmbed0');
			message.channel.send({ embeds: [pageToSend[0]], components: [pageToSend[1]] }).catch(err => { console.error(err); });
			break;
	}
};