import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import items from '../data/itemlist.json';
import natures from '../data/natures.json';
import slugify from '../functions/slugify';
import { createShopPage } from '../functions/shopHandler';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription(enLang.command.shop.description)
		.addSubcommand(subcommand =>
			subcommand.setName('open')
				.setDescription(enLang.command.shop.openDescription)
		)
		.addSubcommandGroup(group =>
			group.setName('buy')
				.setDescription(enLang.command.shop.buyDescription)
				.addSubcommand(subcommand =>
					subcommand.setName('hud')
						.setDescription(enLang.command.shop.buyHudDescription)
						.addStringOption(option =>
							option.setName('hudname')
								.setDescription(enLang.command.shop.buyHudNameDescription)
								.setAutocomplete(true)
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand.setName('pethud')
						.setDescription(enLang.command.shop.buyPetHudDescription)
						.addStringOption(option =>
							option.setName('pethudname')
								.setDescription(enLang.command.shop.buyPetHudNameDescription)
								.setAutocomplete(true)
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand.setName('item')
						.setDescription(enLang.command.shop.buyItemDescription)
						.addStringOption(option =>
							option.setName('itemname')
								.setDescription(enLang.command.shop.buyItemNameDescription)
								.setAutocomplete(true)
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand.setName('pet')
						.setDescription(enLang.command.shop.buyPetDescription)
						.addStringOption(option =>
							option.setName('petname')
								.setDescription(enLang.command.shop.buyPetNameDescription)
								.setAutocomplete(true)
								.setRequired(true)
						)
				)
		)
		.addSubcommandGroup(group =>
			group.setName('view')
				.setDescription(enLang.command.shop.viewDescription)
				.addSubcommand(subcommand =>
					subcommand.setName('hud')
						.setDescription(enLang.command.shop.viewHudDescription)
						.addStringOption(option =>
							option.setName('hudname')
								.setDescription(enLang.command.shop.viewHudNameDescription)
								.setAutocomplete(true)
								.setRequired(true)
						)
				)
				.addSubcommand(subcommand =>
					subcommand.setName('pethud')
						.setDescription(enLang.command.shop.viewPetHudDescription)
						.addStringOption(option =>
							option.setName('pethudname')
								.setDescription(enLang.command.shop.viewPetHudNameDescription)
								.setAutocomplete(true)
								.setRequired(true)
						)
				)
		),

	async execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, any>) {
		await interaction.deferReply();

		async function sendPreview(hudName: string) {
			const hudCanvas = createCanvas(700, 400);
			const ctx = hudCanvas.getContext('2d');
		
			try {
				const bg = await loadImage(`src/img/profile/hud (${hudName}).png`);
				const watermark = await loadImage('src/img/hud_watermark.png');
				ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
				ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);
		
				const attachment = new AttachmentBuilder(hudCanvas.toBuffer('image/png'), { name: `${hudName}_preview.png` });
		
				return await interaction.editReply({ files: [attachment] });
			}
			catch {
				return await interaction.editReply(lang.error.noHUD);
			}
		
		}
		
		async function sendPreviewPet(petHudName: string) {
			const hudCanvas = createCanvas(617, 327);
			const ctx = hudCanvas.getContext('2d');
			try {
				const bg = await loadImage(`src/img/pet/petHud (${petHudName}).png`);
				const watermark = await loadImage('src/img/hud_watermark.png');
				ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
				ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);
		
				const attachment = new AttachmentBuilder(hudCanvas.toBuffer('image/png'), { name: `${petHudName}_preview.png` });
		
				return await interaction.editReply({ files: [attachment] });
			}
			catch {
				return await interaction.editReply(lang.error.noPetHud);
			}
		}
		
		const refP = db.collection('perfis').doc(interaction.user.id);
		const refV = db.collection('vip').doc(interaction.user.id);
		const refPet = db.collection('pet').doc(interaction.user.id);
		const refI = db.collection('inventario').doc(interaction.user.id);
		const colors = ['Black', 'Blue', 'Brown', 'Green', 'Grey', 'Orange', 'Pink', 'Purple', 'Red', 'Yellow'];
		const subcommand = interaction.options.getSubcommand();

		if (interaction.options.getSubcommand() === 'open') {
			const page = createShopPage(interaction.user.id, lang, 'shopmainEmbed0');
		
			await interaction.editReply({ embeds: [page.embed], components: [page.buttonRow] });
		}
		else {
			switch (interaction.options.getSubcommandGroup()) {
				case 'buy':
					switch (subcommand) {
						case 'hud':
							const hudName = slugify(interaction.options.getString('hudname'));
			
							refP.get().then(async docP => {
								if (!docP.exists) {
									await interaction.editReply(lang.error.noProfile);
								}
								else {
									const bal = docP.get('balance');
									let hudCost: number;
			
									colors.includes(hudName) ? hudCost = items.huds.colorPrice : hudCost = items.huds.price;
			
									if (!(items as any).huds[hudName]) {
										await interaction.editReply(lang.error.noHUD);
									}
									else {
										refI.get().then(async docI => {
											const iHuds = docI.get('huds');
			
											if (iHuds.includes(hudName)) {
												await interaction.editReply(lang.error.alreadyHasHUD);
											}
											else if (hudCost > bal) {
												await interaction.editReply(lang.error.noMoney);
											}
											else {
												iHuds.push(hudName);
			
												refP.update({
													balance: bal - hudCost
												});
			
												refI.update({
													huds: iHuds
												}).then(async () => {
													await interaction.editReply(getText(lang.command.shop.boughtHUD, [hudName, lang.command.shop.hudName]));
												});
											}
										});
									}
								}
							});
							break;
						case 'pethud':
							const petHudName = slugify(interaction.options.getString('pethudname'));
			
							refP.get().then(async docP => {
								if (!docP.exists) {
									await interaction.editReply(lang.error.noProfile);
								}
								else {
									const bal = docP.get('balance');
									const userVIP = refV.get();
									let petHudCost: number;
			
									colors.includes(petHudName) ? petHudCost = items.petHuds.price : petHudCost = items.petHuds.vipPrice;
										
									if (!(items as any).petHuds[petHudName]) {
										await interaction.editReply(lang.error.noPetHud);
									}
									else if (userVIP === null && (items as any).petHuds[petHudName].vip) {
										await interaction.editReply(lang.error.noVIPForPetHud);
									}
									else {
										refI.get().then(async docI => {
											const iPetHuds = docI.get('petHuds');
			
											if (iPetHuds.includes(petHudName)) {
												await interaction.editReply(lang.error.alreadyHasPetHud);
											}
											else if (petHudCost > bal) {
												await interaction.editReply(lang.error.noMoney);
											}
											else {
												iPetHuds.push(petHudName);
			
												refI.update({
													petHuds: iPetHuds
												}).then(async () => {
													refP.update({
														balance: bal - petHudCost
													});
			
													await interaction.editReply(getText(lang.command.shop.boughtPetHud, [petHudName, lang.command.shop.petHudName]));
												});
											}
										});
									}
								}
							});
							break;
						case 'item':
							const itemName = slugify(interaction.options.getString('itemname'));

							refP.get().then(async docP => {
								if (!docP.exists) {
									await interaction.editReply(lang.error.noProfile);
								}
								else {
									const bal = docP.get('balance');
									const itemCost = (items as any).items[itemName].price;
			
									if (!(items as any).items[itemName]) {
										await interaction.editReply(lang.error.noItem);
									}
									else {
										refI.get().then(async docI => {
											const iItems = docI.get('items') || [];
			
											if (itemCost > bal) {
												await interaction.editReply(lang.error.noMoney);
											}
											else {
												iItems.push(itemName);
			
												refI.update({
													items: iItems
												}).then(async () => {
													refP.update({
														balance: bal - itemCost
													});
			
													await interaction.editReply(getText(lang.command.shop.boughtItem, [itemName]));
												});
											}
										});
									}
								}
							});
							break;
						case 'pet':
							let petName = slugify(interaction.options.getString('petname'));

							refPet.get().then(async docPet => {
								if (docPet.exists) {
									await interaction.editReply(lang.error.alreadyHasPet);
								}
								else {
									const petCost = (items.pets as any)[petName].price;
			
									if (!(items as any).pets[petName]) {
										await interaction.editReply(lang.error.noItem);
									}
									else {
										refP.get().then(async docP => {
											const bal = docP.get('balance');
											if (petCost > bal) {
												await interaction.editReply(lang.error.noMoney);
											}
											else {
												const rndN = Math.floor(Math.random() * 12);
												const rndG = Math.random();
												const vipPet = (items.pets as any)[petName].vip;
												const userVIP = refV.get();
												const species = (items.pets as any)[petName].species;
												let gender = (items.pets as any)[petName].gender;
			
												if (userVIP === null && vipPet) {
													await interaction.editReply(lang.error.noVIPForPet);
												}
												else {
													if (gender === 'random') rndG < 0.5 ? gender = 'male' : gender = 'female';
													if (!vipPet) petName = 'N/A';
			
													refPet.set({
														gender: `${gender}`,
														hud: 'Grey',
														name: petName,
														nature: (natures as any)[gender][rndN],
														pet: petName,
														species: species
													}).then(async () => {
														refI.get().then(docI => {
															const iPetHuds = docI.get('petHuds');

															if (!iPetHuds) {
																refI.update({
																	'petHuds': ['Grey']
																});
															}
			
															if (vipPet) {
																iPetHuds.push(petName);
																refI.update({
																	petHuds: iPetHuds
																});
															}
														});
			
														refP.update({
															balance: bal - petCost
														});
			
														if (!vipPet) petName = species;
														
														await interaction.editReply(getText(lang.boughtPet, [petName, lang.animalName]));
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
					switch (subcommand) {
						case 'hud': {
							const hudName = interaction.options.getString('hudname');
							
							sendPreview(hudName);
							break;
						}
						case 'pethud': {
							const petHudName = interaction.options.getString('pethudname');
			
							sendPreviewPet(petHudName);
							break;
						}
					}
					break;
			}
		}
	}
};