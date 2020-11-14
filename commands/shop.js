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
	category: 'Economia e Perfil',
	description: 'Faz compras na Loja Incrível!\nOpções disponíveis: `buy`, `huds`, `view`',
	usage: 'shop',

	execute(bot, message, command, args, db, prefix) {
		async function sendPreview(hud) {
			const hudCanvas = createCanvas(700, 400),
				ctx = hudCanvas.getContext('2d');
			try {
				const bg = await loadImage(`images/profile/hud (${hud}).png`);
				const watermark = await loadImage('images/hud_watermark.png');
				ctx.drawImage(bg, 0, 0, hudCanvas.width, hudCanvas.height);
				ctx.drawImage(watermark, 0, 0, hudCanvas.width, hudCanvas.height);

				const attachment = new MessageAttachment(hudCanvas.toBuffer(), `${hud}_preview.png`);

				message.channel.send(attachment);
			}
			catch {
				return message.reply('esse HUD não existe!');
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

				message.channel.send(attachment);
			}
			catch {
				return message.reply('esse HUD não existe!');
			}

		}

		const option = args[0],
			refP = db.collection('perfis').doc(message.author.id),
			refPet = db.collection('pet').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id);
		let mainEmbed = new MessageEmbed()
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setColor('#8000ff')
			.setTitle('Loja Incrível')
			.setDescription(`Bem vindo à Loja Incrível!
			Aqui poderás comprar algumas coisas com o dinheiro que acumulaste até agora.
			Usa \`${prefix}shop [categoria]\` para selecionares uma categoria.`)
			.addFields(
				{ name: 'HUDs', value: '\u200B' },
				{ name: 'PetHUDs', value: '\u200B' },
				{ name: 'Pets', value: '\u200B' },
				{ name: 'Items', value: '\u200B' },
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
						return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
					else {
						const bal = docP.get('balance'),
							itemName = hud.toLowerCase(),
							cost = items.huds[itemName].price;

						if (!cost) {
							return message.reply('esse hud não está à venda!');
						}
						else {
							refI.get().then(docI => {
								const iHuds = docI.get('huds');

								if (iHuds.includes(itemName)) {
									return message.reply('já tens este HUD!');
								}
								else if (cost > bal) {
									return message.reply('não tens dinheiro suficiente!');
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
										message.reply(`compraste o HUD **${titleCase(name)}**!`);
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
						return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
					else {
						const bal = docP.get('balance'),
							itemName = petHud.toLowerCase(),
							cost = items.petHuds[itemName].price,
							vipPetHUD = items.petHuds[itemName].vip;
						const userVIP = docP.get('vip');

						if (!userVIP && vipPetHUD) return message.reply('precisas de ser VIP para comprares este HUD para pets!');

						if (!cost) {
							return message.reply('esse HUD para pets não está à venda!');
						}
						else {
							refI.get().then(docI => {
								const iPetHUDs = docI.get('petHuds');

								if (iPetHUDs.includes(itemName)) {
									return message.reply('já tens este HUD para pets!');
								}
								else if (cost > bal) {
									return message.reply('não tens dinheiro suficiente!');
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

										message.reply(`compraste o HUD **${titleCase(name)}** para pets!`);
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
						return message.reply(`já tens um pet! Se quiseres outro tens de dar o que tens para adoção usando \`${prefix}sendtoadoption\`!`);
					}
					else {
						const itemName = pet.toLowerCase();
						const cost = items.pets[itemName].price;

						if (!cost) {
							return message.reply('esse item não está à venda!');
						}
						else {
							refP.get().then(docP => {
								const bal = docP.get('balance');
								if (cost > bal) {
									return message.reply('não tens dinheiro suficiente!');
								}
								else {
									const rndN = Math.floor(Math.random() * 10),
										rndG = Math.floor(Math.random() * 1),
										vipPet = items.pets[pet].vip,
										userVIP = docP.get('vip');
									let gender = items.pets[pet].gender,
										species = items.pets[pet].species,
										name = '';

									if (!userVIP && vipPet) return message.reply('precisas de ser VIP para comprares este pet!');

									if (species == 'cao') species = 'cão';
									else if (species == 'ponei') species = 'pónei';

									if (gender == 'random') rndG == 0 ? gender = '♂️' : gender = '♀️';
									if (vipPet) name = `${items.pets[pet].name}`;

									refPet.set({
										gender: `${gender}`,
										hud: 'grey',
										name: name,
										nature: natures[rndN],
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
										message.reply(`compraste ${items.pets[pet].pronoun} **${petName}**!`);
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
					.setTitle('Loja Incrível - Pets (VIP)')
					.setDescription(`\`${prefix}shop buy pet [Nome do Animal]\` para comprar.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Akamaru', value: `\nPreço ¤${items.pets.akamaru.price}`, inline: true },
						{ name: 'Iggy', value: `Preço ¤${items.pets.iggy.price}`, inline: true },
					]);
				message.channel.send(petsVIPEmbed);
				break;
			case 'comuns':
				petsCommonEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - Pets (Comuns)')
					.setDescription(`\`${prefix}shop buy pet [Nome do Animal]\` para comprar.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Cabra', value: `Preço ¤${items.pets.cabra.price}`, inline: true },
						{ name: 'Cão', value: `Preço ¤${items.pets.cao.price}`, inline: true },
						{ name: 'Formiga', value: `Preço ¤${items.pets.formiga.price}`, inline: true },
						{ name: 'Galinha', value: `Preço ¤${items.pets.galinha.price}`, inline: true },
						{ name: 'Gato', value: `Preço ¤${items.pets.gato.price}`, inline: true },
						{ name: 'Golfinho', value: `Preço ¤${items.pets.golfinho.price}`, inline: true },
						{ name: 'Pónei', value: `Preço ¤${items.pets.ponei.price}`, inline: true },
					]);
				message.channel.send(petsCommonEmbed);
				break;
			default:
				petsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - Pets')
					.setDescription(`\`${prefix}shop buy pet [Nome do Animal]\` para comprar.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Comuns', value: '\u200B', inline: true },
						{ name: 'VIP', value: '\u200B', inline: true },
					]);
				message.channel.send(petsEmbed);
				break;
			}
			break;
		case 'items':
			itemsEmbed = new MessageEmbed(mainEmbed)
				.setTitle('Loja Incrível - Items')
				.setDescription(`\`${prefix}shop buy item [Nome do Item]\` para comprar.`)
				.setFooter('Página 1 de 1')
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Name License', value: `Licença de Nome\nPreço:${items.items.name_license.price}`, inline: true },
				]);
			message.channel.send(itemsEmbed);
			break;
		case 'pethuds':
			switch (args[1]) {
			case 'cores':
				petHudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - PetHUDs (Cores)')
					.setDescription(`\`${prefix}shop buy pethud [Nome do Item]\` para comprar ou \`${prefix}shop view pethud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Black', value: `Preço ¤${items.petHuds.black.price}`, inline: true },
						{ name: 'Blue', value: `Preço ¤${items.petHuds.blue.price}`, inline: true },
						{ name: 'Brown', value: `Preço ¤${items.petHuds.brown.price}`, inline: true },
						{ name: 'Green', value: `Preço ¤${items.petHuds.green.price}`, inline: true },
						{ name: 'Orange', value: `Preço ¤${items.petHuds.orange.price}`, inline: true },
						{ name: 'Pink', value: `Preço ¤${items.petHuds.pink.price}`, inline: true },
						{ name: 'Purple', value: `Preço ¤${items.petHuds.purple.price}`, inline: true },
						{ name: 'Red', value: `Preço ¤${items.petHuds.red.price}`, inline: true },
						{ name: 'Yellow', value: `Preço ¤${items.petHuds.yellow.price}`, inline: true },
					]);
				message.channel.send(petHudColorsEmbed);
				break;
			case 'vip':
				petHudVIPEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - PetHUDs (VIP)')
					.setDescription(`\`${prefix}shop buy pethud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Bones', value: `Preço ¤${items.petHuds.bones.price}`, inline: true },
						{ name: 'Foxes', value: `Preço ¤${items.petHuds.foxes.price}`, inline: true },
						{ name: 'Pokemon', value: `Preço ¤${items.petHuds.pokemon.price}`, inline: true },
						{ name: 'Undertale', value: `Preço ¤${items.petHuds.undertale.price}`, inline: true },
						{ name: 'Winter', value: `Preço ¤${items.petHuds.winter.price}`, inline: true },
					]);
				message.channel.send(petHudVIPEmbed);
				break;
			default:
				petHudEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - PetHUDs (Cores)')
					.setDescription(`\`${prefix}shop pethuds [sub-categoria]\` para selecionares uma sub-categoria.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Cores', value: '\u200B', inline: true },
						{ name: 'VIP', value: '\u200B', inline: true },
					]);
				message.channel.send(petHudEmbed);
				break;
			}
			break;
		case 'huds':
			switch (args[1]) {
			case 'cores':
				hudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Cores)')
					.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Black', value: `Preço ¤${items.huds.black.price}`, inline: true },
						{ name: 'Blue', value: `Preço ¤${items.huds.blue.price}`, inline: true },
						{ name: 'Brown', value: `Preço ¤${items.huds.brown.price}`, inline: true },
						{ name: 'Green', value: `Preço ¤${items.huds.green.price}`, inline: true },
						{ name: 'Orange', value: `Preço ¤${items.huds.orange.price}`, inline: true },
						{ name: 'Pink', value: `Preço ¤${items.huds.pink.price}`, inline: true },
						{ name: 'Purple', value: `Preço ¤${items.huds.purple.price}`, inline: true },
						{ name: 'Red', value: `Preço ¤${items.huds.red.price}`, inline: true },
						{ name: 'Yellow', value: `Preço ¤${items.huds.yellow.price}`, inline: true },
					]);
				message.channel.send(hudColorsEmbed);
				break;
			case 'jogos':
				switch (page) {
				case 2:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Loja Incrível - HUDs (Jogos)')
						.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.\nPara mudar de página usa \`${prefix}shop huds jogos [página]\``)
						.setFooter('Página 2 de 3')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Glitchtrap', value: `Five Nights at Freddy's\nPreço ¤${items.huds.glitchtrap.price}`, inline: true },
							{ name: 'KDA Akali', value: `League of Legends\nPreço ¤${items.huds.kda_akali.price}`, inline: true },
							{ name: 'Kirby', value: `Nintendo\nPreço ¤${items.huds.kirby1.price}`, inline: true },
							{ name: 'Kirby2', value: `Nintendo\nPreço ¤${items.huds.kirby2.price}`, inline: true },
							{ name: 'Nathan Drake', value: `Uncharted\nPreço ¤${items.huds.nightmare_chica.price}`, inline: true },
							{ name: 'Nightmare Chica', value: `Five Nights at Freddy's\nPreço ¤${items.huds.nightmare_chica.price}`, inline: true },
							{ name: 'Nightmare Foxy', value: `Five Nights at Freddy's\nPreço ¤${items.huds.nightmare_foxy.price}`, inline: true },
							{ name: 'Nunu & Willump', value: `League of Legends\nPreço ¤${items.huds['nunu_&_willump'].price}`, inline: true },
							{ name: 'Reaper Soraka', value: `League of Legends\nPreço ¤${items.huds.reaper_soraka.price}`, inline: true },
						]);
					break;
				case 3:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Loja Incrível - HUDs (Jogos)')
						.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.\nPara mudar de página usa \`${prefix}shop huds jogos [página]\``)
						.setFooter('Página 3 de 3')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Sans', value: `Undertale\nPreço ¤${items.huds.sans.price}`, inline: true },
							{ name: 'Scorpion2', value: `Mortal Kombat\nPreço ¤${items.huds.scorpion1.price}`, inline: true },
							{ name: 'Springtrap', value: `Five Nights at Freddy's\nPreço ¤${items.huds.springtrap.price}`, inline: true },
							{ name: 'Sub-Zero', value: `Mortal Kombat\nPreço ¤${items.huds['sub-zero'].price}`, inline: true },
							{ name: 'The Hillbilly', value: `Dead by Daylight\nPreço ¤${items.huds.dbd1.price}`, inline: true },
						]);
					break;
				default:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Loja Incrível - HUDs (Jogos)')
						.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.\nPara mudar de página usa \`${prefix}shop huds jogos [página]\``)
						.setFooter('Página 1 de 3')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Among Us', value: `\nPreço ¤${items.huds.among_us.price}`, inline: true },
							{ name: 'Clown Gremlins', value: `Dark Deception\nPreço ¤${items.huds.clown_gremlins.price}`, inline: true },
							{ name: 'Ditto', value: `Pokémon\nPreço ¤${items.huds.ditto.price}`, inline: true },
							{ name: 'Diamonds', value: `Minecraft\nPreço ¤${items.huds.diamonds.price}`, inline: true },
							{ name: 'Eclipse Leona', value: `League of Legends\nPreço ¤${items.huds.eclipse_leona.price}`, inline: true },
							{ name: 'Flappy Bird', value: `\nPreço ¤${items.huds.flappy_bird.price}`, inline: true },
							{ name: 'Funtime Foxy', value: `Five Nights at Freddy's\nPreço ¤${items.huds.funtime_foxy.price}`, inline: true },
							{ name: 'Murder Monkeys', value: `Dark Deception\nPreço ¤${items.huds.murder_monkeys.price}`, inline: true },
							{ name: 'Scorpion', value: `Mortal Kombat\nPreço ¤${items.huds.scorpion1.price}`, inline: true },
						]);
					break;
				}
				message.channel.send(hudGamesEmbed);
				break;
			case 'anime':
				switch (page) {
				case 2:
					hudAnimeEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Loja Incrível - HUDs (Anime)')
						.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.\nPara mudar de página usa \`${prefix}shop huds anime [página]\``)
						.setFooter('Página 2 de 2')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'L', value: `Death Note\nPreço ¤${items.huds.l.price}`, inline: true },
							{ name: 'Lelouch', value: `Code Geass\nPreço ¤${items.huds.lelouch1.price}`, inline: true },
							{ name: 'Lelouch2', value: `Code Geass\nPreço ¤${items.huds.lelouch2.price}`, inline: true },
							{ name: 'Shiro', value: `No Game No Life\nPreço ¤${items.huds.shiro.price}`, inline: true },
							{ name: 'Sora & Shiro', value: `No Game No Life\nPreço ¤${items.huds['sora_&_shiro'].price}`, inline: true },
							{ name: 'Yukiteru Yuno', value: `Mirai Nikki\nPreço ¤${items.huds.yukiteru_yuno.price}`, inline: true },
							{ name: 'Yuno', value: `Mirai Nikki\nPreço ¤${items.huds.yukiteru_yuno.price}`, inline: true },
						]);
					break;
				default:
					hudAnimeEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Loja Incrível - HUDs (Anime)')
						.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.\nPara mudar de página usa \`${prefix}shop huds anime [página]\``)
						.setFooter('Página 1 de 2')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Giorno', value: `Jojo's Bizarre Adventure\nPreço ¤${items.huds.giorno.price}`, inline: true },
							{ name: 'Isaac', value: `Angel's of Death\nPreço ¤${items.huds.isaac.price}`, inline: true },
							{ name: 'Itachi', value: `Naruto\nPreço ¤${items.huds.itachi.price}`, inline: true },
							{ name: 'Kakashi', value: `Naruto\nPreço ¤${items.huds.kakashi.price}`, inline: true },
							{ name: 'Kaneki', value: `Tokyo Ghoul\nPreço ¤${items.huds.kaneki.price}`, inline: true },
							{ name: 'Kaneki2', value: `Tokyo Ghoul\nPreço ¤${items.huds.kaneki2.price}`, inline: true },
							{ name: 'Morioh Gang', value: `Jojo's Bizarre Adventure Part 4\nPreço ¤${items.huds.morioh_gang.price}`, inline: true },
							{ name: 'Naruto', value: `Naruto\nPreço ¤${items.huds.naruto.price}`, inline: true },
							{ name: 'Nezuko Kamado', value: `Naruto\nPreço ¤${items.huds.nezuko_kamado.price}`, inline: true },
						]);
					break;
				}
				message.channel.send(hudAnimeEmbed);
				break;
			case 'cartoons':
				hudCartoonsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Cartoons)')
					.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Courage', value: `Courage the Cowardly Dog\nPreço ¤${items.huds.courage.price}`, inline: true },
						{ name: 'Jake', value: `Adventure Time\nPreço ¤${items.huds.jake.price}`, inline: true },
						{ name: 'Jake2', value: `Adventure Time\nPreço ¤${items.huds.jake2.price}`, inline: true },
						{ name: 'Gumball & Darwin', value: `The Amazing World of Gumball\nPreço ¤${items.huds['gumball_&_darwin'].price}`, inline: true },
					]);
				message.channel.send(hudCartoonsEmbed);
				break;
			case 'marvel':
				hudMarvelEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Marvel)')
					.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Captain America', value: `Herói\nPreço ¤${items.huds.captain_america.price}`, inline: true },
						{ name: 'Chaos King', value: `Vilão\nPreço ¤${items.huds.chaos_king.price}`, inline: true },
						{ name: 'Green Goblin', value: `Vilão\nPreço ¤${items.huds.green_goblin.price}`, inline: true },
						{ name: 'Iron Man', value: `Herói\nPreço ¤${items.huds.iron_man.price}`, inline: true },
						{ name: 'Onslaught', value: `Vilão\nPreço ¤${items.huds.onslaught.price}`, inline: true },
						{ name: 'Spider-Man', value: `Herói\nPreço ¤${items.huds['spider-man'].price}`, inline: true },
						{ name: 'Thanos', value: `Vilão\nPreço ¤${items.huds.thanos.price}`, inline: true },
					]);
				message.channel.send(hudMarvelEmbed);
				break;
			case 'dc':
				hudDCEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (DC)')
					.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Batman', value: `Herói\nPreço ¤${items.huds.batman.price}`, inline: true },
						{ name: 'Joker', value: `Vilão\nPreço ¤${items.huds.joker.price}`, inline: true },
						{ name: 'Superman', value: `Herói\nPreço ¤${items.huds.superman.price}`, inline: true },
					]);
				message.channel.send(hudDCEmbed);
				break;
			case 'vocaloids':
				hudVocaloidsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Cartoons)')
					.setDescription(`\`${prefix}shop buy hud [Nome do Item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Miku Hatsune', value: `Preço ¤${items.huds.miku_hatsune.price}`, inline: true },
					]);
				message.channel.send(hudVocaloidsEmbed);
				break;
			default:
				hudEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs')
					.setDescription(`\`${prefix}shop huds [sub-categoria]\` para selecionares uma sub-categoria.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Cores', value: '\u200B', inline: true },
						{ name: 'Jogos', value: '\u200B', inline: true },
						{ name: 'Anime', value: '\u200B', inline: true },
						{ name: 'Cartoons', value: '\u200B', inline: true },
						{ name: 'Marvel', value: '\u200B', inline: true },
						{ name: 'DC', value: '\u200B', inline: true },
						{ name: 'Vocaloids', value: '\u200B', inline: true },
					]);
				message.channel.send(hudEmbed);
				break;
			}
			break;
		default:
			mainEmbed = new MessageEmbed(mainEmbed)
				.attachFiles(['./images/shop.gif'])
				.setImage('attachment://shop.gif');
			message.channel.send(mainEmbed);
			break;
		}
	},
};
