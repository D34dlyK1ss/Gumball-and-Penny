import { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import items from '../data/itemlist.json';
import getText from './getText';

export function createShopPage(userId: string, lang:Record<string, any>, embedName: string) {
	let embed: EmbedBuilder;
	let buttonRow: ActionRowBuilder<ButtonBuilder>;
	let buttonRow2: ActionRowBuilder<ButtonBuilder>;
	const mainEmbed = new EmbedBuilder()
		.setColor('DarkPurple')
		.setTitle(lang.awesomeStore)
		.setDescription(lang.command.shop.welcome)
		.addFields(
			{ name: `- HUDs\n- Pet HUDs\n- Pets\n- ${lang.items}`, value: '\u200B' }
		);

	switch (embedName) {
		case 'shopmainEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif');

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel('HUDs')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel('Pet HUDs')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shoppetsEmbed0${userId}`)
						.setLabel('Pets')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shopitemsEmbed0${userId}`)
						.setLabel(lang.items)
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - HUDs`)
				.setFields([
					{ name: `- ${lang.colors}\n- ${lang.games}\n- Anime\n- Cartoon\n- Marvel\n- DC\n- Vocaloids`, value: '\u200B' }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudColorsEmbed0${userId}`)
						.setLabel(lang.colors)
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed0${userId}`)
						.setLabel(lang.games)
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shophudAnimeEmbed0${userId}`)
						.setLabel('Anime')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shophudCartoonEmbed0${userId}`)
						.setLabel('Cartoon')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shophudMarvelEmbed0${userId}`)
						.setLabel('Marvel')
						.setStyle(1)
				);

			buttonRow2 = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudDCEmbed0${userId}`)
						.setLabel('DC')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shophudVocaloidsEmbed0${userId}`)
						.setLabel('Vocaloids')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);

			break;
		case 'shophudColorsEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.colors})`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
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

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudGamesEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/4` })
				.setFields([
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

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle(2)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed1${userId}`)
						.setLabel(lang.nextPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudGamesEmbed1':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 2/4` })
				.setFields([
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

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed0${userId}`)
						.setLabel(lang.prevPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed2${userId}`)
						.setLabel(lang.nextPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudGamesEmbed2':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 3/4` })
				.setFields([
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

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed1${userId}`)
						.setLabel(lang.prevPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed3${userId}`)
						.setLabel(lang.nextPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudGamesEmbed3':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (${lang.games})`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 4/4` })
				.setFields([
					{ name: 'Sub-Zero', value: `Mortal Kombat\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'The Hillbilly', value: `Dead by Daylight\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'The Runaway Kid', value: `Little Nightmares\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Warly', value: `Don't Starve\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Willow', value: `Don't Starve\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Wormwood', value: `Don't Starve\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Yasuo', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Yone', value: `League of Legends\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);
			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudGamesEmbed2${userId}`)
						.setLabel(lang.prevPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle(2)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudAnimeEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/2` })
				.setFields([
					{ name: 'Giorno', value: `Jojo's Bizarre Adventure\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Isaac', value: `Angels of Death\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Itachi', value: `Naruto\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kakashi', value: `Naruto\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kaneki A', value: `Tokyo Ghoul\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kaneki B', value: `Tokyo Ghoul\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'L', value: `Death Note\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Lelouch A', value: `Code Geass\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Lelouch B', value: `Code Geass\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);
			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle(2)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId(`shophudAnimeEmbed1${userId}`)
						.setLabel(lang.nextPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudAnimeEmbed1':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Anime)`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 2/2` })
				.setFields([
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
			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudAnimeEmbed0${userId}`)
						.setLabel(lang.prevPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle(2)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudCartoonEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Cartoon)`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Courage', value: `Courage the Cowardly Dog\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Gumball & Darwin', value: `${lang.command.shop.cartoon.tawog}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Jake A', value: `${lang.command.shop.cartoon.adventureTime}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Jake B', value: `${lang.command.shop.cartoon.adventureTime}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Kenny McCormick', value: `South Park\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Professor Chaos', value: `South Park\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Stan Marsh', value: `South Park\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'We Bare Bears', value: `${lang.command.shop.cartoon.weBareBears}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudMarvelEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Marvel)`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Captain America', value: `${lang.command.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Chaos King', value: `${lang.command.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Green Goblin', value: `${lang.command.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Iron Man', value: `${lang.command.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Onslaught', value: `${lang.command.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Spider-Man', value: `${lang.command.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Thanos', value: `${lang.command.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudDCEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (DC)`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Batman', value: `${lang.command.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Joker', value: `${lang.command.shop.villain}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Superman', value: `${lang.command.shop.hero}\n<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shophudVocaloidsEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - HUDs (Vocaloids)`)
				.setDescription(getText(lang.command.shop.toBuyHud, [lang.command.shop.hudName, lang.command.shop.hudName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Miku Hatsune', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true },
					{ name: 'Rin Kagamine', value: `<a:gpCoin:898355693193662464>${items.huds.price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shophudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetHudEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - Pet HUDs (${lang.colors})`)
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: `- ${lang.colors}\n - VIP`, value: '\u200B' }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetHudColorsEmbed0${userId}`)
						.setLabel(lang.colors)
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shoppetHudVIPEmbed0${userId}`)
						.setLabel('VIP')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetHudColorsEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pet HUDs (${lang.colors})`)
				.setDescription(getText(lang.command.shop.toBuyPetHud, [lang.command.shop.petHudName, lang.command.shop.petHudName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
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

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetHudVIPEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pet HUDs (VIP)`)
				.setDescription(getText(lang.command.shop.toBuyPetHud, [lang.command.shop.petHudName, lang.command.shop.petHudName]))
				.setFooter({ text: `${lang.page} 1/3` })
				.setFields([
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

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('disabled')
						.setLabel(lang.prevPage)
						.setStyle(2)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId(`shoppetHudVIPEmbed1${userId}`)
						.setLabel(lang.nextPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetHudVIPEmbed1':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pet HUDs (VIP)`)
				.setDescription(getText(lang.command.shop.toBuyPetHud, [lang.command.shop.petHudName, lang.command.shop.petHudName]))
				.setFooter({ text: `${lang.page} 2/3` })
				.setFields([
					{ name: 'Gumball', value: `${lang.command.shop.cartoon.tawog}\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Ladybugs', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Luna', value: `Sailor Moon\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Papyrus', value: `Undertale\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Penguins', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Pink Panther', value: `${lang.command.shop.cartoon.pinkPanther}\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Pink Pokémon', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Saitama', value: `One Punch Man\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Scooby-Doo', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetHudVIPEmbed0${userId}`)
						.setLabel(lang.prevPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shoppetHudVIPEmbed2${userId}`)
						.setLabel(lang.nextPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetHudVIPEmbed2':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pet HUDs (VIP)`)
				.setDescription(getText(lang.command.shop.toBuyPetHud, [lang.command.shop.petHudName, lang.command.shop.petHudName]))
				.setFooter({ text: `${lang.page} 3/3` })
				.setFields([
					{ name: 'Snoopy', value: `Peanuts\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Tigers', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Totoro', value: `My Neighbor Totoro\n<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Undertale', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Unicorns', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true },
					{ name: 'Winter', value: `<a:gpCoin:898355693193662464>${items.petHuds.vipPrice}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetHudVIPEmbed1${userId}`)
						.setLabel(lang.prevPage)
						.setStyle(2),
					new ButtonBuilder()
						.setCustomId('disabled')
						.setLabel(lang.nextPage)
						.setStyle(2)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId(`shoppetHudEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetsEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setImage('https://i.imgur.com/fCIJGQW.gif')
				.setTitle(`${lang.awesomeStore} - Pets`)
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: `- ${lang.common}\n- VIP`, value: '\u200B' }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetsCommonEmbed0${userId}`)
						.setLabel(lang.common)
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shoppetsVIPEmbed0${userId}`)
						.setLabel('VIP')
						.setStyle(1),
					new ButtonBuilder()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetsCommonEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (${lang.common})`)
				.setDescription(getText(lang.command.shop.toBuyPet, [lang.command.shop.animalName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Ant', value: `<a:gpCoin:898355693193662464>${items.pets.Ant.price}`, inline: true },
					{ name: 'Cat', value: `<a:gpCoin:898355693193662464>${items.pets.Cat.price}`, inline: true },
					{ name: 'Chicken', value: `<a:gpCoin:898355693193662464>${items.pets.Chicken.price}`, inline: true },
					{ name: 'Dog', value: `<a:gpCoin:898355693193662464>${items.pets.Dog.price}`, inline: true },
					{ name: 'Dolphin', value: `<a:gpCoin:898355693193662464>${items.pets.Dolphin.price}`, inline: true },
					{ name: 'Frog', value: `<a:gpCoin:898355693193662464>${items.pets.Frog.price}`, inline: true },
					{ name: 'Goat', value: `<a:gpCoin:898355693193662464>${items.pets.Goat.price}`, inline: true },
					{ name: 'Hamster', value: `<a:gpCoin:898355693193662464>${items.pets.Hamster.price}`, inline: true },
					{ name: 'Pony', value: `<a:gpCoin:898355693193662464>${items.pets.Pony.price}`, inline: true },
					{ name: 'Scorpion', value: `<a:gpCoin:898355693193662464>${items.pets.Scorpion.price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetsEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shoppetsVIPEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - Pets (VIP)`)
				.setDescription(getText(lang.command.shop.toBuyPet, [lang.command.shop.animalName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Akamaru', value: `Naruto\n<a:gpCoin:898355693193662464>${items.pets.Akamaru.price}`, inline: true },
					{ name: 'Frosch', value: `Fairy Tail\n<a:gpCoin:898355693193662464>${items.pets.Frosch.price}`, inline: true },
					{ name: 'Happy', value: `Fairy Tail\n<a:gpCoin:898355693193662464>${items.pets.Happy.price}`, inline: true },
					{ name: 'Iggy', value: `Jojo's Bizarre Adventure\n<a:gpCoin:898355693193662464>${items.pets.Iggy.price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shoppetsEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
		case 'shopitemsEmbed0':
			embed = EmbedBuilder.from(mainEmbed)
				.setTitle(`${lang.awesomeStore} - ${lang.items}`)
				.setDescription(getText(lang.command.shop.toBuyItem, [lang.command.shop.itemName]))
				.setFooter({ text: `${lang.page} 1/1` })
				.setFields([
					{ name: 'Name License', value: `${lang.nameLicense}\n<a:gpCoin:898355693193662464>${items.items['Name License'].price}`, inline: true }
				]);

			buttonRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`shopmainEmbed0${userId}`)
						.setLabel(lang.back)
						.setStyle(4),
					new ButtonBuilder()
						.setCustomId(`shopExit${userId}`)
						.setLabel(lang.exit)
						.setStyle(4)
				);
			break;
	}
	return {embed, buttonRow, buttonRow2};
}

export function shopButtonHandler(button: ButtonInteraction, lang: Record<string, any>) {
	if (!button.customId.endsWith(button.user.id)) {
		button.reply({ content: lang.error.notAuthor, ephemeral: true });
	}
	else if (button.customId.slice(0, -18).endsWith('Exit')) {
		button.update({ content: lang.command.shop.exited, embeds: [], components: [] });
	}
	else {
		const page = createShopPage(button.user.id, lang, button.customId.slice(0, -18));

		if (!page.buttonRow2) {
			button.update({ embeds: [page.embed], components: [page.buttonRow] });
		}
		else {
			button.update({ embeds: [page.embed], components: [page.buttonRow, page.buttonRow2] });
		}
	}
}