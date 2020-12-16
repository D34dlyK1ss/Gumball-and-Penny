const { MessageEmbed, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const items = require('../itemlist.json'),
	natures = require('../natures.json');

function titleCase(str) {
	const splitStr = str.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}

function slugify(str) {
	const map = {
		'-' : ' ',
		'a' : 'á|à|ã|â|À|Á|Ã|Â',
		'e' : 'é|è|ê|É|È|Ê',
		'i' : 'í|ì|î|Í|Ì|Î',
		'o' : 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
		'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
		'c' : 'ç|Ç',
		'n' : 'ñ|Ñ',
	};

	for (const pattern in map) {
		str = str.replace(new RegExp(map[pattern], 'g'), pattern);
	}

	return str;
}

module.exports = {
	name: 'shop',
	aliases: ['s'],

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		async function sendPreview(hud) {
			const hudCanvas = createCanvas(700, 400),
				ctx = hudCanvas.getContext('2d');
			try {
				const bg = await loadImage(`images/profile/hud (${hud}).png`);
				const watermark = await loadImage('images/hud_watermark.png');
				ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
				ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

				const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${hud}_preview.png`);

				message.channel.send(attachment).catch();
			}
			catch {
				return message.reply(lang.error.noHUD).catch();
			}

		}

		async function sendPreviewPet(petHud) {
			const hudCanvas = createCanvas(617, 327),
				ctx = hudCanvas.getContext('2d');
			try {
				const bg = await loadImage(`images/pet/hud_pet (${petHud}).png`);
				const watermark = await loadImage('images/hud_watermark.png');
				ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
				ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

				const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${petHud}_preview.png`);

				message.channel.send(attachment).catch();
			}
			catch {
				return message.reply(lang.error.noPetHUD).catch();
			}

		}

		const option = args[0],
			refP = db.collection('perfis').doc(message.author.id),
			refPet = db.collection('pet').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id);
		let mainEmbed = new MessageEmbed()
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setColor('#8000ff')
			.setTitle(lang.awesomeStore)
			.setDescription(`${lang.shop.welcome}\`${prefix}shop [${lang.shop.category}]\`${lang.shop.toSelect}`)
			.addFields(
				{ name: 'HUDs', value: '\u200B', inline: true },
				{ name: 'PetHUDs', value: '\u200B', inline: true },
				{ name: 'Pets', value: '\u200B', inline: true },
				{ name: 'Items', value: '\u200B', inline: true },
			);

		let hudEmbed,
			hudColorsEmbed,
			hudGamesEmbed,
			hudAnimeEmbed,
			hudCartoonsEmbed,
			hudMarvelEmbed,
			hudDCEmbed,
			hudVocaloidsEmbed,
			petHudEmbed,
			petHudColorsEmbed,
			petHudVIPEmbed,
			petsEmbed,
			petsCommonEmbed,
			petsVIPEmbed,
			itemsEmbed;

		const page = parseInt(args[2]) || 1;
		let hud = '', petHud = '', pet = '';

		switch (option) {
		case 'buy':
			switch (args[1]) {
			case 'hud':
				hud = hud.concat(args).toLowerCase().replace(/[,]/g, '_');
				refP.get().then(docP => {
					if (!docP.exists) {
						return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
					}
					else {
						const bal = docP.get('balance'),
							itemName = hud.toLowerCase(),
							cost = items.huds[itemName].price;

						if (!cost) {
							return message.reply(lang.error.noHUD).catch();
						}
						else {
							refI.get().then(docI => {
								const iHuds = docI.get('huds');

								if (iHuds.includes(itemName)) {
									return message.reply(lang.error.alreadyHasHUD).catch();
								}
								else if (cost > bal) {
									return message.reply(lang.error.noMoney).catch();
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
										message.reply(`${lang.shop.boughtHUD}**${titleCase(name)}**!`).catch();
									});
								}
							});
						}
					}
				});
				break;
			case 'pethud':
				petHud = petHud.concat(args[2]).toLowerCase().replace(/[,]/g, '_');
				refP.get().then(docP => {
					if (!docP.exists) {
						return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
					}
					else {
						const bal = docP.get('balance'),
							itemName = petHud.toLowerCase(),
							cost = items.petHuds[itemName].price,
							vipPetHUD = items.petHuds[itemName].vip;
						const userVIP = docP.get('vip');

						if (!userVIP && vipPetHUD) return message.reply(lang.error.noVIPForPetHUD).catch();

						if (!cost) {
							return message.reply(lang.error.noPetHUD).catch();
						}
						else {
							refI.get().then(docI => {
								const iPetHUDs = docI.get('petHuds');

								if (iPetHUDs.includes(itemName)) {
									return message.reply(lang.error.alreadyHasPetHUD).catch();
								}
								else if (cost > bal) {
									return message.reply(lang.error.noMoney).catch();
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

										message.reply(`${lang.shop.boughtPetHUD}**${titleCase(name)}**!`).catch();
									});
								}
							});
						}
					}
				});
				break;
			case 'pet':
				pet = pet.concat(slugify(args[2])).toLowerCase().replace(/[,]/g, '_');
				refPet.get().then(async docPet => {
					if (docPet.exists) {
						return message.reply(`${lang.error.alreadyHasPet}\`${prefix}sendtoadoption\`!`).catch();
					}
					else {
						const itemName = pet.toLowerCase();
						const cost = items.pets[itemName].price;

						if (!cost) {
							return message.reply(lang.error.noItem).catch();
						}
						else {
							refP.get().then(docP => {
								const bal = docP.get('balance');
								if (cost > bal) {
									return message.reply(lang.error.noMoney).catch();
								}
								else {
									const rndN = Math.floor(Math.random() * 12),
										rndG = Math.random(),
										vipPet = items.pets[pet].vip,
										userVIP = docP.get('vip'),
										species = items.pets[pet].species;
									let gender = items.pets[pet].gender,
										name = '';

									if (!userVIP && vipPet) return message.reply(lang.error.noVIPForPet).catch();

									if (gender == 'random') rndG < 0.5 ? gender = '♂️' : gender = '♀️';
									if (vipPet) name = `${items.pets[pet].name}`;

									refPet.set({
										gender: `${gender}`,
										hud: 'grey',
										name: name,
										nature: natures[gender][rndN],
										pet: pet,
										species: titleCase(species),
									}).then(() => {
										refI.get().then(async docI => {
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
										const vip = items.pets[pet].vip;

										if (vip) petName = name;
										message.reply(`${lang.youBought}**${titleCase(petName)}**!`).catch();
									});
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
				hud = hud.concat(args.slice(2)).toLowerCase().replace(/[,]/g, '_');
				sendPreview(hud);
				break;
			case 'pethud':
				petHud = petHud.concat(args.slice(2)).toLowerCase().replace(/[,]/g, '_');
				sendPreviewPet(petHud);
				break;
			}
			break;
		case 'pets':
			switch (args[1]) {
			case 'vip':
				petsVIPEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - Pets (VIP)`)
					.setDescription(`\`${prefix}shop buy pet [${lang.shop.animalName}]\`${lang.shop.toBuy}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Akamaru', value: `Naruto\n**¤${items.pets.akamaru.price}**`, inline: true },
						{ name: 'Frosch', value: `Fairy Tail\n**¤${items.pets.frosch.price}**`, inline: true },
						{ name: 'Happy', value: `Fairy Tail\n**¤${items.pets.happy.price}**`, inline: true },
						{ name: 'Iggy', value: `Jojo's Bizzare Adventure\n**¤${items.pets.iggy.price}**`, inline: true },
					]);
				message.channel.send(petsVIPEmbed).catch();
				break;
			case 'common':
				petsCommonEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - Pets (Common)`)
					.setDescription(`\`${prefix}shop buy pet [${lang.shop.animalName}]\`${lang.shop.toBuy}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Cabra', value: `**¤${items.pets.cabra.price}**`, inline: true },
						{ name: 'Cão', value: `**¤${items.pets.cao.price}**`, inline: true },
						{ name: 'Escorpião', value: `**¤${items.pets.escorpiao.price}**`, inline: true },
						{ name: 'Formiga', value: `**¤${items.pets.formiga.price}**`, inline: true },
						{ name: 'Galinha', value: `**¤${items.pets.galinha.price}**`, inline: true },
						{ name: 'Gato', value: `**¤${items.pets.gato.price}**`, inline: true },
						{ name: 'Golfinho', value: `**¤${items.pets.golfinho.price}**`, inline: true },
						{ name: 'Hamster', value: `**¤${items.pets.hamster.price}**`, inline: true },
						{ name: 'Pónei', value: `**¤${items.pets.ponei.price}**`, inline: true },
						{ name: 'Sapo', value: `**¤${items.pets.sapo.price}**`, inline: true },
					]);
				message.channel.send(petsCommonEmbed).catch();
				break;
			default:
				petsEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - Pets`)
					.setDescription(`\`${prefix}shop pets [${lang.shop.category}]\`${lang.shop.toBuy}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Common', value: '\u200B', inline: true },
						{ name: 'VIP', value: '\u200B', inline: true },
					]);
				message.channel.send(petsEmbed).catch();
				break;
			}
			break;
		case 'items':
			itemsEmbed = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Items`)
				.setDescription(`\`${prefix}shop buy item [Nome do Item]\`${lang.shop.toBuy}`)
				.setFooter(`${lang.page} 1 de 1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Name License', value: `${lang.nameLicense}\n**¤${items.items.name_license.price}**`, inline: true },
				]);
			message.channel.send(itemsEmbed.catch());
			break;
		case 'pethuds':
			switch (args[1]) {
			case 'colors':
				petHudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - PetHUDs (Colors)`)
					.setDescription(`\`${prefix}shop buy pethud [${lang.shop.petHUDName}]\`${lang.shop.toBuyOr}\`${prefix}shop view pethud [${lang.shop.petHUDName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Black', value: `**¤${items.petHuds.black.price}**`, inline: true },
						{ name: 'Blue', value: `**¤${items.petHuds.blue.price}**`, inline: true },
						{ name: 'Brown', value: `**¤${items.petHuds.brown.price}**`, inline: true },
						{ name: 'Green', value: `**¤${items.petHuds.green.price}**`, inline: true },
						{ name: 'Orange', value: `**¤${items.petHuds.orange.price}**`, inline: true },
						{ name: 'Pink', value: `**¤${items.petHuds.pink.price}**`, inline: true },
						{ name: 'Purple', value: `**¤${items.petHuds.purple.price}**`, inline: true },
						{ name: 'Red', value: `**¤${items.petHuds.red.price}**`, inline: true },
						{ name: 'Yellow', value: `**¤${items.petHuds.yellow.price}**`, inline: true },
					]);
				message.channel.send(petHudColorsEmbed).catch();
				break;
			case 'vip':
				petHudVIPEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - PetHUDs (VIP)`)
					.setDescription(`\`${prefix}shop buy pethud [${lang.shop.petHUDName}]\`${lang.shop.toBuyOr}\`${prefix}shop view pethud [${lang.shop.petHUDName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Bones', value: `**¤${items.petHuds.bones.price}**`, inline: true },
						{ name: 'Foxes', value: `**¤${items.petHuds.foxes.price}**`, inline: true },
						{ name: 'Ghost-Type', value: `Pokémon\n**¤${items.petHuds['ghost-type'].price}**`, inline: true },
						{ name: 'Luna', value: `Sailor Moon\n**¤${items.petHuds.luna.price}**`, inline: true },
						{ name: 'Pokemon', value: `**¤${items.petHuds.pokemon.price}**`, inline: true },
						{ name: 'Saitama', value: `One Punch Man\n**¤${items.petHuds.saitama.price}**`, inline: true },
						{ name: 'Totoro', value: `My Neighbor Totoro\n**¤${items.petHuds.totoro.price}**`, inline: true },
						{ name: 'Undertale', value: `**¤${items.petHuds.undertale.price}**`, inline: true },
						{ name: 'Winter', value: `**¤${items.petHuds.winter.price}**`, inline: true },
					]);
				message.channel.send(petHudVIPEmbed).catch();
				break;
			default:
				petHudEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - PetHUDs (Colors)`)
					.setDescription(`\`${prefix}shop pethuds [${lang.shop.subCategory}]\`${lang.shop.toSelectASubCat}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Colors', value: '\u200B', inline: true },
						{ name: 'VIP', value: '\u200B', inline: true },
					]);
				message.channel.send(petHudEmbed).catch();
				break;
			}
			break;
		case 'huds':
			switch (args[1]) {
			case 'colors':
				hudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - HUDs (Colors)`)
					.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Black', value: `**¤${items.huds.black.price}**`, inline: true },
						{ name: 'Blue', value: `**¤${items.huds.blue.price}**`, inline: true },
						{ name: 'Brown', value: `**¤${items.huds.brown.price}**`, inline: true },
						{ name: 'Green', value: `**¤${items.huds.green.price}**`, inline: true },
						{ name: 'Orange', value: `**¤${items.huds.orange.price}**`, inline: true },
						{ name: 'Pink', value: `**¤${items.huds.pink.price}**`, inline: true },
						{ name: 'Purple', value: `**¤${items.huds.purple.price}**`, inline: true },
						{ name: 'Red', value: `**¤${items.huds.red.price}**`, inline: true },
						{ name: 'Yellow', value: `**¤${items.huds.yellow.price}**`, inline: true },
					]);
				message.channel.send(hudColorsEmbed).catch();
				break;
			case 'games':
				switch (page) {
				case 2:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
						.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}\n${lang.toChangePage}\`${prefix}shop huds games [${lang.shop.page}]\``)
						.setFooter(`${lang.page} 2 de 3`)
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Glitchtrap', value: `Five Nights at Freddy's\n**¤${items.huds.glitchtrap.price}**`, inline: true },
							{ name: 'KDA Akali', value: `League of Legends\n**¤${items.huds.kda_akali.price}**`, inline: true },
							{ name: 'Kirby', value: `Nintendo\n**¤${items.huds.kirby.price}**`, inline: true },
							{ name: 'Kirby2', value: `Nintendo\n**¤${items.huds.kirby2.price}**`, inline: true },
							{ name: 'Nathan Drake', value: `Uncharted\n**¤${items.huds.nightmare_chica.price}**`, inline: true },
							{ name: 'Nightmare Chica', value: `Five Nights at Freddy's\n**¤${items.huds.nightmare_chica.price}**`, inline: true },
							{ name: 'Nightmare Foxy', value: `Five Nights at Freddy's\n**¤${items.huds.nightmare_foxy.price}**`, inline: true },
							{ name: 'Nunu & Willump', value: `League of Legends\n**¤${items.huds['nunu_&_willump'].price}**`, inline: true },
							{ name: 'Reaper Soraka', value: `League of Legends\n**¤${items.huds.reaper_soraka.price}**`, inline: true },
						]);
					break;
				case 3:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
						.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}\n${lang.toChangePage}\`${prefix}shop huds games [${lang.shop.page}]\``)
						.setFooter(`${lang.page} 3 de 3`)
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Sans', value: `Undertale\n**¤${items.huds.sans.price}**`, inline: true },
							{ name: 'Scorpion', value: `Mortal Kombat\n**¤${items.huds.scorpion.price}**`, inline: true },
							{ name: 'Scorpion2', value: `Mortal Kombat\n**¤${items.huds.scorpion2.price}**`, inline: true },
							{ name: 'Springtrap', value: `Five Nights at Freddy's\n**¤${items.huds.springtrap.price}**`, inline: true },
							{ name: 'Sub-Zero', value: `Mortal Kombat\n**¤${items.huds['sub-zero'].price}**`, inline: true },
							{ name: 'The Hillbilly', value: `Dead by Daylight\n**¤${items.huds['the_hillbilly'].price}**`, inline: true },
						]);
					break;
				default:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
						.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}\n${lang.toChangePage}\`${prefix}shop huds games [${lang.shop.page}]\``)
						.setFooter(`${lang.page} 1 de 3`)
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Among Us', value: `\n**¤${items.huds.among_us.price}**`, inline: true },
							{ name: 'Clown Gremlins', value: `Dark Deception\n**¤${items.huds.clown_gremlins.price}**`, inline: true },
							{ name: 'Ditto', value: `Pokémon\n**¤${items.huds.ditto.price}**`, inline: true },
							{ name: 'Diamonds', value: `Minecraft\n**¤${items.huds.diamonds.price}**`, inline: true },
							{ name: 'Eclipse Leona', value: `League of Legends\n**¤${items.huds.eclipse_leona.price}**`, inline: true },
							{ name: 'Flappy Bird', value: `\n**¤${items.huds.flappy_bird.price}**`, inline: true },
							{ name: 'Funtime Foxy', value: `Five Nights at Freddy's\n**¤${items.huds.funtime_foxy.price}**`, inline: true },
							{ name: 'Murder Monkeys', value: `Dark Deception\n**¤${items.huds.murder_monkeys.price}**`, inline: true },
						]);
					break;
				}
				message.channel.send(hudGamesEmbed).catch();
				break;
			case 'anime':
				switch (page) {
				case 2:
					hudAnimeEmbed = new MessageEmbed(mainEmbed)
						.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
						.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}\n${lang.toChangePage}\`${prefix}shop huds anime [${lang.shop.page}]\``)
						.setFooter(`${lang.page} 2 de 2`)
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'L', value: `Death Note\n**¤${items.huds.l.price}**`, inline: true },
							{ name: 'Lelouch', value: `Code Geass\n**¤${items.huds.lelouch.price}**`, inline: true },
							{ name: 'Lelouch2', value: `Code Geass\n**¤${items.huds.lelouch2.price}**`, inline: true },
							{ name: 'Shiro', value: `No Game No Life\n**¤${items.huds.shiro.price}**`, inline: true },
							{ name: 'Sora & Shiro', value: `No Game No Life\n**¤${items.huds['sora_&_shiro'].price}**`, inline: true },
							{ name: 'Yukiteru Yuno', value: `Mirai Nikki\n**¤${items.huds['yukiteru_&_yuno'].price}**`, inline: true },
							{ name: 'Yuno', value: `Mirai Nikki\n**¤${items.huds.yuno.price}**`, inline: true },
						]);
					break;
				default:
					hudAnimeEmbed = new MessageEmbed(mainEmbed)
						.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
						.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}\n${lang.toChangePage}\`${prefix}shop huds anime [${lang.shop.page}]\``)
						.setFooter(`${lang.page} 1 de 2`)
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Giorno', value: `Jojo's Bizarre Adventure\n**¤${items.huds.giorno.price}**`, inline: true },
							{ name: 'Isaac', value: `Angel's of Death\n**¤${items.huds.isaac.price}**`, inline: true },
							{ name: 'Itachi', value: `Naruto\n**¤${items.huds.itachi.price}**`, inline: true },
							{ name: 'Kakashi', value: `Naruto\n**¤${items.huds.kakashi.price}**`, inline: true },
							{ name: 'Kaneki', value: `Tokyo Ghoul\n**¤${items.huds.kaneki.price}**`, inline: true },
							{ name: 'Kaneki2', value: `Tokyo Ghoul\n**¤${items.huds.kaneki2.price}**`, inline: true },
							{ name: 'Morioh Gang', value: `Jojo's Bizarre Adventure Part 4\n**¤${items.huds.morioh_gang.price}**`, inline: true },
							{ name: 'Naruto', value: `Naruto\n**¤${items.huds.naruto.price}**`, inline: true },
							{ name: 'Nezuko Kamado', value: `Demon Slayer\n**¤${items.huds.nezuko_kamado.price}**`, inline: true },
						]);
					break;
				}
				message.channel.send(hudAnimeEmbed).catch();
				break;
			case 'cartoons':
				hudCartoonsEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - HUDs (Cartoons)`)
					.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Courage', value: `Courage the Cowardly Dog\n**¤${items.huds.courage.price}**`, inline: true },
						{ name: 'Jake', value: `Adventure Time\n**¤${items.huds.jake.price}**`, inline: true },
						{ name: 'Jake2', value: `Adventure Time\n**¤${items.huds.jake2.price}**`, inline: true },
						{ name: 'Gumball & Darwin', value: `The Amazing World of Gumball\n**¤${items.huds['gumball_&_darwin'].price}**`, inline: true },
					]);
				message.channel.send(hudCartoonsEmbed).catch();
				break;
			case 'marvel':
				hudMarvelEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - HUDs (Marvel)`)
					.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Captain America', value: `${lang.shop.hero}\n**¤${items.huds.captain_america.price}**`, inline: true },
						{ name: 'Chaos King', value: `${lang.shop.villain}\n**¤${items.huds.chaos_king.price}**`, inline: true },
						{ name: 'Green Goblin', value: `${lang.shop.villain}\n**¤${items.huds.green_goblin.price}**`, inline: true },
						{ name: 'Iron Man', value: `${lang.shop.hero}\n**¤${items.huds.iron_man.price}**`, inline: true },
						{ name: 'Onslaught', value: `${lang.shop.villain}\n**¤${items.huds.onslaught.price}**`, inline: true },
						{ name: 'Spider-Man', value: `${lang.shop.hero}\n**¤${items.huds['spider-man'].price}**`, inline: true },
						{ name: 'Thanos', value: `${lang.shop.villain}\n**¤${items.huds.thanos.price}**`, inline: true },
					]);
				message.channel.send(hudMarvelEmbed).catch();
				break;
			case 'dc':
				hudDCEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - HUDs (DC)`)
					.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Batman', value: `${lang.shop.hero}\n**¤${items.huds.batman.price}**`, inline: true },
						{ name: 'Joker', value: `${lang.shop.villain}\n**¤${items.huds.joker.price}**`, inline: true },
						{ name: 'Superman', value: `${lang.shop.hero}\n**¤${items.huds.superman.price}**`, inline: true },
					]);
				message.channel.send(hudDCEmbed).catch();
				break;
			case 'vocaloids':
				hudVocaloidsEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - HUDs (Cartoons)`)
					.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
					.setFooter(`${lang.page} 1 de 1`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Miku Hatsune', value: `**¤${items.huds.miku_hatsune.price}**`, inline: true },
					]);
				message.channel.send(hudVocaloidsEmbed).catch();
				break;
			default:
				hudEmbed = new MessageEmbed(mainEmbed)
					.setTitle(`${lang.awesomeStore} - HUDs`)
					.setDescription(`\`${prefix}shop huds [${lang.shop.subCategory}]\`${lang.shop.toSelectASubCat}`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Colors', value: '\u200B', inline: true },
						{ name: 'Games', value: '\u200B', inline: true },
						{ name: 'Anime', value: '\u200B', inline: true },
						{ name: 'Cartoons', value: '\u200B', inline: true },
						{ name: 'Marvel', value: '\u200B', inline: true },
						{ name: 'DC', value: '\u200B', inline: true },
						{ name: 'Vocaloids', value: '\u200B', inline: true },
					]);
				message.channel.send(hudEmbed).catch();
				break;
			}
			break;
		default:
			mainEmbed = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/Ed2AqAr.gif');
			message.channel.send(mainEmbed).catch();
			break;
		}
	},
};
