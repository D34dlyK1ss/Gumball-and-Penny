import { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, User } from 'discord.js';
import items from '../data/itemlist.json';

let author: User;

export function createShopPage(user: User, lang:Record<string, any>, prefix: string, embedName: string) {
	if (!user) return 0;
	author = user;

	let embedToExport: MessageEmbed;
	let buttonRow: MessageActionRow;
	let buttonRow2: MessageActionRow;
	const mainEmbed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(lang.awesomeStore)
		.setDescription(lang.shop.welcome)
		.addFields(
			{ name: `- HUDs\n- PetHUDs\n- Pets\n- ${lang.items}`, value: '\u200B' }
		);

	switch (embedName) {
		case 'shopmainEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif');

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel('HUDs')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shoppetHudEmbed0')
						.setLabel('PetHUDs')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shoppetsEmbed0')
						.setLabel('Pets')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shopitemsEmbed0')
						.setLabel(lang.items)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - HUDs`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: `- ${lang.colors}\n- ${lang.games}\n- Anime\n- Cartoon\n- Marvel\n- DC\n- Vocaloids`, value: '\u200B' }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudColorsEmbed0')
						.setLabel(lang.colors)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shophudGamesEmbed0')
						.setLabel(lang.games)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shophudAnimeEmbed0')
						.setLabel('Anime')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shophudCartoonEmbed0')
						.setLabel('Cartoon')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shophudMarvelEmbed0')
						.setLabel('Marvel')
						.setStyle('PRIMARY')
				);

			// eslint-disable-next-line prefer-const
			buttonRow2 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudDCEmbed0')
						.setLabel('DC')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shophudVocaloidsEmbed0')
						.setLabel('Vocaloids')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shopmainEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);

			break;
		case 'shophudColorsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.colors})`)
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
					{ name: 'Yellow', value: `¤${items.huds.colorPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
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
					{ name: 'Glitchtrap', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('shophudGamesEmbed1')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
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
					{ name: 'Nightmare Chica', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudGamesEmbed0')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shophudGamesEmbed2')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed2':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
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
					{ name: 'Springtrap', value: `Five Nights at Freddy's\n¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudGamesEmbed1')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shophudGamesEmbed3')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed3':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
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
					{ name: 'Yone', value: `League of Legends\n¤${items.huds.price}`, inline: true }
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudGamesEmbed2')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudAnimeEmbed0':
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
					{ name: 'Lelouch B', value: `Code Geass\n¤${items.huds.price}`, inline: true }
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('shophudAnimeEmbed1')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			
			buttonRow2 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudAnimeEmbed1':
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
					{ name: 'Zero Two B', value: `Darling in the FranXX\n¤${items.huds.price}`, inline: true }
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudAnimeEmbed0')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudCartoonEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Cartoon)`)
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
					{ name: 'We Bare Bears', value: `¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudMarvelEmbed0':
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
					{ name: 'Thanos', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudDCEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (DC)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Batman', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true },
					{ name: 'Joker', value: `${lang.shop.villain}\n¤${items.huds.price}`, inline: true },
					{ name: 'Superman', value: `${lang.shop.hero}\n¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudVocaloidsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Vocaloids)`)
				.setDescription(`\`${prefix}shop buy hud [${lang.shop.hudName}]\`${lang.shop.toBuyOr}\`${prefix}shop view hud [${lang.shop.hudName}]\`${lang.shop.toSee}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Miku Hatsune', value: `¤${items.huds.price}`, inline: true },
					{ name: 'Rin Kagamine', value: `¤${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shophudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - PetHUDs (${lang.colors})`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: `- ${lang.colors}\n - VIP`, value: '\u200B' }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetHudColorsEmbed0')
						.setLabel(lang.colors)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shoppetHudVIPEmbed0')
						.setLabel('VIP')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shopmainEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudColorsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHUDs (${lang.colors})`)
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
					{ name: 'Yellow', value: `¤${items.petHuds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetHudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudVIPEmbed0':
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
					{ name: 'Ghost-Type', value: `Pokémon\n¤${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('shoppetHudVIPEmbed1')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shoppetHudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudVIPEmbed1':
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
					{ name: 'Scooby-Doo', value: `¤${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetHudVIPEmbed0')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shoppetHudVIPEmbed2')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('shoppetHudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudVIPEmbed2':
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
					{ name: 'Winter', value: `¤${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetHudVIPEmbed1')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId('shoppetHudEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - Pets`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: `- ${lang.common}\n- VIP`, value: '\u200B' }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetsCommonEmbed0')
						.setLabel(lang.common)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shoppetsVIPEmbed0')
						.setLabel('VIP')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('shopmainEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetsCommonEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (${lang.common})`)
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
					{ name: 'Scorpion', value: `¤${items.pets.scorpion.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetsEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetsVIPEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (VIP)`)
				.setDescription(`\`${prefix}shop buy pet [${lang.shop.animalName}]\`${lang.shop.toBuy}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Akamaru', value: `Naruto\n¤${items.pets.akamaru.price}`, inline: true },
					{ name: 'Frosch', value: `Fairy Tail\n¤${items.pets.frosch.price}`, inline: true },
					{ name: 'Happy', value: `Fairy Tail\n¤${items.pets.happy.price}`, inline: true },
					{ name: 'Iggy', value: `Jojo's Bizarre Adventure\n¤${items.pets.iggy.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shoppetsEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER')
				);
			break;
		case 'shopitemsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - ${lang.items}`)
				.setDescription(`\`${prefix}shop buy item [${lang.shop.itemName}]\`${lang.shop.toBuy}`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Name License', value: `${lang.nameLicense}\n¤${items.items.name_license.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('shopmainEmbed0')
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('shopExit')
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
	}
	return [embedToExport, buttonRow, buttonRow2];
}

export function shopButtonHandler(button: ButtonInteraction, lang: Record<string, any>, prefix: string) {
	if (!author) {
		button.reply({ content: lang.interaction.buttonExpired, ephemeral: true });
	}
	else if (author.id !== button.user.id) {
		button.reply({ content: lang.interaction.notAuthor, ephemeral: true });
	}
	else if (button.customId.endsWith('Exit')) {
		button.update({ content: lang.shop.exited, embeds: [], components: [] });
	}
	else {
		const toSend:any = createShopPage(author, lang, prefix, button.customId);

		if (toSend[2] === undefined) {
			button.update({ embeds: [toSend[0]], components: [toSend[1]] });
		}
		else {
			button.update({ embeds: [toSend[0]], components: [toSend[1], toSend[2]] });
		}
	}
}