import { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import items from '../data/itemlist.json';
import getText from './getText';

export function createShopPage(userId: string, lang:Record<string, any>, prefix: string, embedName: string) {
	let embedToExport: MessageEmbed;
	let buttonRow: MessageActionRow;
	let buttonRow2: MessageActionRow;
	const mainEmbed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(lang.awesomeStore)
		.setDescription(lang.shop.welcome)
		.addFields(
			{ name: `- HUDs\n- PetHuds\n- Pets\n- ${lang.items}`, value: '\u200B' }
		);

	switch (embedName) {
		case 'shopmainEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif');

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel('HUDs')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel('PetHuds')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shoppetsEmbed0${userId}`)
						.setLabel('Pets')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shopitemsEmbed0${userId}`)
						.setLabel(lang.items)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
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
						.setCustomId(`shophudColorsEmbed0${userId}`)
						.setLabel(lang.colors)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shophudGamesEmbed0${userId}`)
						.setLabel(lang.games)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shophudAnimeEmbed0${userId}`)
						.setLabel('Anime')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shophudCartoonEmbed0${userId}`)
						.setLabel('Cartoon')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shophudMarvelEmbed0${userId}`)
						.setLabel('Marvel')
						.setStyle('PRIMARY')
				);

			// eslint-disable-next-line prefer-const
			buttonRow2 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudDCEmbed0${userId}`)
						.setLabel('DC')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shophudVocaloidsEmbed0${userId}`)
						.setLabel('Vocaloids')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);

			break;
		case 'shophudColorsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.colors})`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Black', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Blue', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Brown', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Green', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Orange', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Pink', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Purple', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Red', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true },
					{ name: 'Yellow', value: `<a:gpCoin:898355693193662464>${items.huds.colorPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Among Us', value: `\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Clown Gremlins', value: `Dark Deception\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Cuphead', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Ditto', value: `Pokémon\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Diamonds', value: `Minecraft\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Eclipse Leona', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Flappy Bird', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Funtime Foxy', value: `Five Nights at Freddy's\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Glitchtrap', value: `Five Nights at Freddy's\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId(`shophudGamesEmbed1${userId}`)
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 2/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Hollow Knight', value: `Hollow Knight\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Ink Bendy', value: `Bendy and the Ink Machine\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'KDA Ahri', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'KDA Akali', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kirby A', value: `Nintendo\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kirby B', value: `Nintendo\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Murder Monkeys', value: `Dark Deception\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Nathan Drake', value: `Uncharted\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Nightmare Chica', value: `Five Nights at Freddy's\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudGamesEmbed0${userId}`)
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shophudGamesEmbed2${userId}`)
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed2':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 3/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Nightmare Foxy', value: `Five Nights at Freddy's\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Nunu & Willump', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Poros', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Reaper Soraka', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Sans', value: `Undertale\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Scorpion A', value: `Mortal Kombat\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Scorpion B', value: `Mortal Kombat\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Six', value: `Little Nightmares\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Springtrap', value: `Five Nights at Freddy's\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudGamesEmbed1${userId}`)
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shophudGamesEmbed3${userId}`)
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudGamesEmbed3':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 4/4`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Sub-Zero', value: `Mortal Kombat\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'The Hillbilly', value: `Dead by Daylight\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'The Runaway Kid', value: `Little Nightmares\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Warly', value: `Don't Starve\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Willow', value: `Don't Starve\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Wormwood', value: `Don't Starve\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Yasuo', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Yone', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudGamesEmbed2${userId}`)
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudAnimeEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/2`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Giorno', value: `Jojo's Bizarre Adventure\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Isaac', value: `Angel's of Death\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Itachi', value: `Naruto\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kakashi', value: `Naruto\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kaneki A', value: `Tokyo Ghoul\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kaneki B', value: `Tokyo Ghoul\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'L', value: `Death Note\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Lelouch A', value: `Code Geass\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Lelouch B', value: `Code Geass\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId(`shophudAnimeEmbed1${userId}`)
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudAnimeEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 2/2`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Morioh Gang', value: `Jojo's Bizarre Adventure Part 4\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Naruto', value: `Naruto\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Nezuko Kamado', value: `Demon Slayer\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Shiro', value: `No Game No Life\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Sora & Shiro', value: `No Game No Life\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Yukiteru Yuno', value: `Mirai Nikki\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Yuno', value: `Mirai Nikki\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Zero Two A', value: `Darling in the FranXX\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Zero Two B', value: `Darling in the FranXX\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);
			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudAnimeEmbed0${userId}`)
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudCartoonEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Cartoon)`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Courage', value: `Courage the Cowardly Dog\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Gumball & Darwin', value: `The Amazing World of Gumball\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Jake A', value: `Adventure Time\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Jake B', value: `Adventure Time\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kenny McCormick', value: `South Park\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Professor Chaos', value: `South Park\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Stan Marsh', value: `South Park\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'We Bare Bears', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudMarvelEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Marvel)`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Captain America', value: `${lang.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Chaos King', value: `${lang.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Green Goblin', value: `${lang.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Iron Man', value: `${lang.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Onslaught', value: `${lang.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Spider-Man', value: `${lang.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Thanos', value: `${lang.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudDCEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (DC)`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Batman', value: `${lang.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Joker', value: `${lang.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Superman', value: `${lang.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shophudVocaloidsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Vocaloids)`)
				.setDescription(getText(lang.shop.toBuyHud, [prefix, lang.shop.hudName, prefix, lang.shop.hudName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Miku Hatsune', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Rin Kagamine', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - PetHuds (${lang.colors})`)
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: `- ${lang.colors}\n - VIP`, value: '\u200B' }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shoppetHudColorsEmbed0${userId}`)
						.setLabel(lang.colors)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shoppetHudVIPEmbed0${userId}`)
						.setLabel('VIP')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudColorsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHuds (${lang.colors})`)
				.setDescription(getText(lang.shop.toBuyPetHud, [prefix, lang.shop.petHudName, prefix, lang.shop.petHudName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Black', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Blue', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Brown', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Green', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Orange', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Pink', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Purple', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Red', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true },
					{ name: 'Yellow', value: `<a:gpCoin:898355693193662464>${items.petHuds.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudVIPEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHuds (VIP)`)
				.setDescription(getText(lang.shop.toBuyPetHud, [prefix, lang.shop.petHudName, prefix, lang.shop.petHudName]))
				.setFooter(`${lang.page} 1/3`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Among Us A', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Among Us B', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Bones', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Butterflies', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Foxes', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Geometry A', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Geometry B', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Geometry C', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Ghost-Type', value: `Pokémon\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId(`shoppetHudVIPEmbed1${userId}`)
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudVIPEmbed1':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHuds (VIP)`)
				.setDescription(getText(lang.shop.toBuyPetHud, [prefix, lang.shop.petHudName, prefix, lang.shop.petHudName]))
				.setFooter(`${lang.page} 2/3`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Gumball', value: `The Amazing World of Gumball\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Ladybugs', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Luna', value: `Sailor Moon\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Papyrus', value: `Undertale\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Penguins', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Pink Panther', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Pink Pokémon', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Saitama', value: `One Punch Man\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Scooby-Doo', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shoppetHudVIPEmbed0${userId}`)
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shoppetHudVIPEmbed2${userId}`)
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetHudVIPEmbed2':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - PetHuds (VIP)`)
				.setDescription(getText(lang.shop.toBuyPetHud, [prefix, lang.shop.petHudName, prefix, lang.shop.petHudName]))
				.setFooter(`${lang.page} 3/3`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Snoopy', value: `Peanuts\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Tigers', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Totoro', value: `My Neighbor Totoro\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Undertale', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Unicorns', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Winter', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shoppetHudVIPEmbed1${userId}`)
						.setLabel(lang.prevPage)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle('SECONDARY')
						.setDisabled(true),
					new MessageButton()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
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
						.setCustomId(`shoppetsCommonEmbed0${userId}`)
						.setLabel(lang.common)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shoppetsVIPEmbed0${userId}`)
						.setLabel('VIP')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetsCommonEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (${lang.common})`)
				.setDescription(getText(lang.shop.toBuyPet, [prefix, lang.shop.animalName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Ant', value: `<a:gpCoin:898355693193662464>${items.pets.ant.price}`, inline: true },
					{ name: 'Cat', value: `<a:gpCoin:898355693193662464>${items.pets.cat.price}`, inline: true },
					{ name: 'Chicken', value: `<a:gpCoin:898355693193662464>${items.pets.chicken.price}`, inline: true },
					{ name: 'Dog', value: `<a:gpCoin:898355693193662464>${items.pets.dog.price}`, inline: true },
					{ name: 'Dolphin', value: `<a:gpCoin:898355693193662464>${items.pets.dolphin.price}`, inline: true },
					{ name: 'Frog', value: `<a:gpCoin:898355693193662464>${items.pets.frog.price}`, inline: true },
					{ name: 'Goat', value: `<a:gpCoin:898355693193662464>${items.pets.goat.price}`, inline: true },
					{ name: 'Hamster', value: `<a:gpCoin:898355693193662464>${items.pets.hamster.price}`, inline: true },
					{ name: 'Pony', value: `<a:gpCoin:898355693193662464>${items.pets.pony.price}`, inline: true },
					{ name: 'Scorpion', value: `<a:gpCoin:898355693193662464>${items.pets.scorpion.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shoppetsEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
		case 'shoppetsVIPEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (VIP)`)
				.setDescription(getText(lang.shop.toBuyPet, [prefix, lang.shop.animalName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Akamaru', value: `Naruto\n<a:gpCoin:898355693193662464>${items.pets.akamaru.price}`, inline: true },
					{ name: 'Frosch', value: `Fairy Tail\n<a:gpCoin:898355693193662464>${items.pets.frosch.price}`, inline: true },
					{ name: 'Happy', value: `Fairy Tail\n<a:gpCoin:898355693193662464>${items.pets.happy.price}`, inline: true },
					{ name: 'Iggy', value: `Jojo's Bizarre Adventure\n<a:gpCoin:898355693193662464>${items.pets.iggy.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shoppetsEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER')
				);
			break;
		case 'shopitemsEmbed0':
			embedToExport = new MessageEmbed(mainEmbed)
				.setTitle(`${lang.awesomeStore} - ${lang.items}`)
				.setDescription(getText(lang.shop.toBuyItem, [prefix, lang.shop.itemName]))
				.setFooter(`${lang.page} 1/1`)
				.spliceFields(0, mainEmbed.fields.length, [
					{ name: 'Name License', value: `${lang.nameLicense}\n<a:gpCoin:898355693193662464>${items.items.name_license.price}`, inline: true }
				]);

			buttonRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle('DANGER')
				);
			break;
	}
	return [embedToExport, buttonRow, buttonRow2];
}

export function shopButtonHandler(button: ButtonInteraction, lang: Record<string, any>, prefix: string) {
	if (!button.customId.endsWith(button.user.id)) {
		button.reply({ content: lang.error.notAuthor, ephemeral: true });
	}
	else if (button.customId.slice(0, -18).endsWith('Exit')) {
		button.update({ content: lang.shop.exited, embeds: [], components: [] });
	}
	else {
		const toSend:any = createShopPage(button.user.id, lang, prefix, button.customId.slice(0, -18));

		if (toSend[2] === undefined) {
			button.update({ embeds: [toSend[0]], components: [toSend[1]] });
		}
		else {
			button.update({ embeds: [toSend[0]], components: [toSend[1], toSend[2]] });
		}
	}
}