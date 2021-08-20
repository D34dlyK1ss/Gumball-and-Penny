import { MessageEmbed, MessageActionRow, MessageButton, User } from 'discord.js';
import * as items from '../data/itemlist.json';

function createShopPage(author: User, lang:Record<string, any>, prefix: string, embedName: string) {
	let embedToExport: MessageEmbed;
	let buttonRow: MessageActionRow;
	let buttonRow2: MessageActionRow;
	const mainEmbed = new MessageEmbed()
			.setColor('#9900ff')
			.setTitle(lang.awesomeStore)
			.setDescription(lang.shop.welcome)
			.setFooter(`Used by ${author.username}`)
			.addFields(
				{ name: 'HUDs', value: '\u200B', inline: true },
				{ name: 'PetHUDs', value: '\u200B', inline: true },
				{ name: 'Pets', value: '\u200B', inline: true },
				{ name: 'Items', value: '\u200B', inline: true },
			);

	switch (embedName) {
		case 'mainEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif');

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('HUDs')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('petHudEmbed0')
						.setLabel('PetHUDs')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('petsEmbed0')
						.setLabel('Pets')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('itemsEmbed0')
						.setLabel('Items')
						.setStyle('PRIMARY'),
				);
			break;
		case 'hudEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - HUDs`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Colors', value: '\u200B', inline: true },
					{ name: 'Games', value: '\u200B', inline: true },
					{ name: 'Anime', value: '\u200B', inline: true },
					{ name: 'Cartoons', value: '\u200B', inline: true },
					{ name: 'Marvel', value: '\u200B', inline: true },
					{ name: 'DC', value: '\u200B', inline: true },
					{ name: 'Vocaloids', value: '\u200B', inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudColorsEmbed0')
						.setLabel('Colors')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('hudGamesEmbed0')
						.setLabel('Games')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('hudAnimeEmbed0')
						.setLabel('Anime')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('hudCartoonsEmbed0')
						.setLabel('Cartoons')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('hudMarvelEmbed0')
						.setLabel('Marvel')
						.setStyle('PRIMARY')
				);

			buttonRow2 = new MessageActionRow()
				.addComponents(
				new MessageButton()
					.setCustomId('hudDCEmbed0')
					.setLabel('DC')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('hudVocaloidsEmbed0')
					.setLabel('Vocaloids')
					.setStyle('PRIMARY'),
				new MessageButton()
						.setCustomId('mainEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);

			break;
		case 'hudColorsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Colors)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Black', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Blue', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Brown', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Green', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Orange', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Pink', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Purple', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Red', value: `¤${items.huds.colorPrice}`, inline: true },
					{ name: 'Yellow', value: `¤${items.huds.colorPrice}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudGamesEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Among Us', value: `\n¤${items.huds.price}`, inline: true },
					{ name: 'Clown Gremlins', value: `Dark Deception\n¤${items.huds.price}`, inline: true },
					{ name: 'Cuphead', value: `¤${items.huds.price}`, inline: true },
					{ name: 'Ditto', value: `Pokémon\n¤${items.huds.price}`, inline: true },
					{ name: 'Diamonds', value: `Minecraft\n¤${items.huds.price}`, inline: true },
					{ name: 'Eclipse Leona', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'Flappy Bird', value: `¤${items.huds.price}`, inline: true },
					{ name: 'Funtime Foxy', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true },
					{ name: 'Glitchtrap', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('hudGamesEmbed1')
						.setLabel('Next Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudGamesEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 2/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Hollow Knight', value: `Hollow Knight\n¤${items.huds.price}`, inline: true },
					{ name: 'Ink Bendy', value: `Bendy and the Ink Machine\n¤${items.huds.price}`, inline: true },
					{ name: 'KDA Ahri', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'KDA Akali', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'Kirby A', value: `Nintendo\n¤${items.huds.price}`, inline: true },
					{ name: 'Kirby B', value: `Nintendo\n¤${items.huds.price}`, inline: true },
					{ name: 'Murder Monkeys', value: `Dark Deception\n¤${items.huds.price}`, inline: true },
					{ name: 'Nathan Drake', value: `Uncharted\n¤${items.huds.price}`, inline: true },
					{ name: 'Nightmare Chica', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true },
				]);

				buttonRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('hudGamesEmbed0')
							.setLabel('Prev. Page')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('hudGamesEmbed2')
							.setLabel('Next Page')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('hudEmbed0')
							.setLabel('Back')
							.setStyle('DANGER')
					);
			break;
		case 'hudGamesEmbed2':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 3/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Nightmare Foxy', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true },
					{ name: 'Nunu & Willump', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'Poros', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'Reaper Soraka', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'Sans', value: `Undertale\n¤${items.huds.price}`, inline: true },
					{ name: 'Scorpion A', value: `Mortal Kombat\n¤${items.huds.price}`, inline: true },
					{ name: 'Scorpion B', value: `Mortal Kombat\n¤${items.huds.price}`, inline: true },
					{ name: 'Six', value: `Little Nightmares\n¤${items.huds.price}`, inline: true },
					{ name: 'Springtrap', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudGamesEmbed1')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('hudGamesEmbed3')
						.setLabel('Next Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudGamesEmbed3':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Games)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 4/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Sub-Zero', value: `Mortal Kombat\n¤${items.huds.price}`, inline: true },
					{ name: 'The Hillbilly', value: `Dead by Daylight\n¤${items.huds.price}`, inline: true },
					{ name: 'The Runaway Kid', value: `Little Nightmares\n¤${items.huds.price}`, inline: true },
					{ name: 'Warly', value: `Don't Starve\n¤${items.huds.price}`, inline: true },
					{ name: 'Willow', value: `Don't Starve\n¤${items.huds.price}`, inline: true },
					{ name: 'Wormwood', value: `Don't Starve\n¤${items.huds.price}`, inline: true },
					{ name: 'Yasuo', value: `League of Legends\n¤${items.huds.price}`, inline: true },
					{ name: 'Yone', value: `League of Legends\n¤${items.huds.price}`, inline: true },
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudGamesEmbed2')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel('Next Page')
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
					);
			break;
		case 'hudAnimeEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/2`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Giorno', value: `Jojo's Bizarre Adventure\n¤${items.huds.price}`, inline: true },
					{ name: 'Isaac', value: `Angel's of Death\n¤${items.huds.price}`, inline: true },
					{ name: 'Itachi', value: `Naruto\n¤${items.huds.price}`, inline: true },
					{ name: 'Kakashi', value: `Naruto\n¤${items.huds.price}`, inline: true },
					{ name: 'Kaneki A', value: `Tokyo Ghoul\n¤${items.huds.price}`, inline: true },
					{ name: 'Kaneki B', value: `Tokyo Ghoul\n¤${items.huds.price}`, inline: true },
					{ name: 'L', value: `Death Note\n¤${items.huds.price}`, inline: true },
					{ name: 'Lelouch A', value: `Code Geass\n¤${items.huds.price}`, inline: true },
					{ name: 'Lelouch B', value: `Code Geass\n¤${items.huds.price}`, inline: true },
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('hudAnimeEmbed1')
						.setLabel('Next Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudAnimeEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 2/2`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Morioh Gang', value: `Jojo's Bizarre Adventure Part 4\n¤${items.huds.price}`, inline: true },
					{ name: 'Naruto', value: `Naruto\n¤${items.huds.price}`, inline: true },
					{ name: 'Nezuko Kamado', value: `Demon Slayer\n¤${items.huds.price}`, inline: true },
					{ name: 'Shiro', value: `No Game No Life\n¤${items.huds.price}`, inline: true },
					{ name: 'Sora & Shiro', value: `No Game No Life\n¤${items.huds.price}`, inline: true },
					{ name: 'Yukiteru Yuno', value: `Mirai Nikki\n¤${items.huds.price}`, inline: true },
					{ name: 'Yuno', value: `Mirai Nikki\n¤${items.huds.price}`, inline: true },
					{ name: 'Zero Two A', value: `Darling in the FranXX\n¤${items.huds.price}`, inline: true },
					{ name: 'Zero Two B', value: `Darling in the FranXX\n¤${items.huds.price}`, inline: true },
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudAnimeEmbed0')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel('Next Page')
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudCartoonsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Cartoons)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Courage', value: `Courage the Cowardly Dog\n¤${items.huds.price}`, inline: true },
					{ name: 'Gumball & Darwin', value: `The Amazing World of Gumball\n¤${items.huds.price}`, inline: true },
					{ name: 'Jake A', value: `Adventure Time\n¤${items.huds.price}`, inline: true },
					{ name: 'Jake B', value: `Adventure Time\n¤${items.huds.price}`, inline: true },
					{ name: 'Kenny McCormick', value: `South Park\n¤${items.huds.price}`, inline: true },
					{ name: 'Professor Chaos', value: `South Park\n¤${items.huds.price}`, inline: true },
					{ name: 'Stan Marsh', value: `South Park\n¤${items.huds.price}`, inline: true },
					{ name: 'We Bare Bears', value: `¤${items.huds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudMarvelEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Marvel)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Captain America', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true },
					{ name: 'Chaos King', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true },
					{ name: 'Green Goblin', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true },
					{ name: 'Iron Man', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true },
					{ name: 'Onslaught', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true },
					{ name: 'Spider-Man', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true },
					{ name: 'Thanos', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudDCEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (DC)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Batman', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true },
					{ name: 'Joker', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true },
					{ name: 'Superman', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'hudVocaloidsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Vocaloids)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Miku Hatsune', value: `¤${items.huds.price}`, inline: true },
					{ name: 'Rin Kagamine', value: `¤${items.huds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('hudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'petHudEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - PetHUDs (Colors)`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Colors', value: '\u200B', inline: true },
					{ name: 'VIP', value: '\u200B', inline: true },
				]);

			buttonRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('petHudColorsEmbed0')
					.setLabel('Colors')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('petHudVIPEmbed0')
					.setLabel('VIP')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('mainEmbed0')
					.setLabel('Back')
					.setStyle('DANGER')
			);
			break;
		case 'petHudColorsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHUDs (Colors)`)
				.setDescription(`\`${prefix}shop buy pethud [${lang.shop.petHUDName}]\`${lang.shop.toBuyOr}\`${prefix}shop view pethud [${lang.shop.petHUDName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Black', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Blue', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Brown', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Green', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Orange', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Pink', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Purple', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Red', value: `¤${items.petHuds.price}`, inline: true },
					{ name: 'Yellow', value: `¤${items.petHuds.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('petHudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'petHudVIPEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHUDs (VIP)`)
				.setDescription(`\`${prefix}shop buy pethud [${lang.shop.petHUDName}]\`${lang.shop.toBuyOr}\`${prefix}shop view pethud [${lang.shop.petHUDName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/3`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Among Us A', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Among Us B', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Bones', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Butterflies', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Foxes', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Geometry A', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Geometry B', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Geometry C', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Ghost-Type', value: `Pokémon\n¤${items.petHuds.vipPrice}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('petHudVIPEmbed1')
						.setLabel('Next Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('petHudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
					);
			break;
		case 'petHudVIPEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHUDs (VIP)`)
				.setDescription(`\`${prefix}shop buy pethud [${lang.shop.petHUDName}]\`${lang.shop.toBuyOr}\`${prefix}shop view pethud [${lang.shop.petHUDName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 2/3`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Gumball', value: `The Amazing World of Gumball\n¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Ladybugs', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Luna', value: `Sailor Moon\n¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Papyrus', value: `Undertale\n¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Penguins', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Pink Panther', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Pink Pokémon', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Saitama', value: `One Punch Man\n¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Scooby-Doo', value: `¤${items.petHuds.vipPrice}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('petHudVIPEmbed0')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('petHudVIPEmbed2')
						.setLabel('Next Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('petHudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
					);
			break;
		case 'petHudVIPEmbed2':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHUDs (VIP)`)
				.setDescription(`\`${prefix}shop buy pethud [${lang.shop.petHUDName}]\`${lang.shop.toBuyOr}\`${prefix}shop view pethud [${lang.shop.petHUDName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 3/3`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Snoopy', value: `Peanuts\n¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Tigers', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Totoro', value: `My Neighbor Totoro\n¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Undertale', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Unicorns', value: `¤${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Winter', value: `¤${items.petHuds.vipPrice}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('petHudVIPEmbed1')
						.setLabel('Prev. Page')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel('Next Page')
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('petHudEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
					);
			break;
		case 'petsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - Pets`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Common', value: '\u200B', inline: true },
					{ name: 'VIP', value: '\u200B', inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('petsCommonEmbed0')
						.setLabel('Common')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('petsVIPEmbed0')
						.setLabel('VIP')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('mainEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'petsCommonEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (Common)`)
				.setDescription(`\`${prefix}shop buy pet [${lang.shop.animalName}]\`${lang.shop.toBuy}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Ant', value: `¤${items.pets.ant.price}`, inline: true },
					{ name: 'Cat', value: `¤${items.pets.cat.price}`, inline: true },
					{ name: 'Chicken', value: `¤${items.pets.chicken.price}`, inline: true },
					{ name: 'Dog', value: `¤${items.pets.dog.price}`, inline: true },
					{ name: 'Dolphin', value: `¤${items.pets.dolphin.price}`, inline: true },
					{ name: 'Frog', value: `¤${items.pets.frog.price}`, inline: true },
					{ name: 'Goat', value: `¤${items.pets.goat.price}`, inline: true },
					{ name: 'Hamster', value: `¤${items.pets.hamster.price}`, inline: true },
					{ name: 'Pony', value: `¤${items.pets.pony.price}`, inline: true },
					{ name: 'Scorpion', value: `¤${items.pets.scorpion.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('petsEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'petsVIPEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (VIP)`)
				.setDescription(`\`${prefix}shop buy pet [${lang.shop.animalName}]\`${lang.shop.toBuy}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Akamaru', value: `Naruto\n¤${items.pets.akamaru.price}`, inline: true },
					{ name: 'Frosch', value: `Fairy Tail\n¤${items.pets.frosch.price}`, inline: true },
					{ name: 'Happy', value: `Fairy Tail\n¤${items.pets.happy.price}`, inline: true },
					{ name: 'Iggy', value: `Jojo's Bizarre Adventure\n¤${items.pets.iggy.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('petsEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
		case 'itemsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Items`)
				.setDescription(`\`${prefix}shop buy item [${lang.shop.itemName}]\`${lang.shop.toBuy}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Name License', value: `${lang.nameLicense}\n¤${items.items.name_license.price}`, inline: true },
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('mainEmbed0')
						.setLabel('Back')
						.setStyle('DANGER')
				);
			break;
	}

	return [embedToExport, buttonRow, buttonRow2];
}

export default createShopPage;