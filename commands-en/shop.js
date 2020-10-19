const { MessageEmbed, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const items = require('../itemlist.json');

module.exports = {
	name: 'shop',
	aliases: ['s'],
	category: 'Economy e Ptofile',
	description: 'Buy things at the Awesome Store!\nOptions: `buy`, `huds`, `view`',
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
				return message.reply('that HUD doesn\'t exist!');
			}

		}

		const option = args[0],
			refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id);
		let mainEmbed = new MessageEmbed()
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setColor('#8000ff')
			.setTitle('Awesome Store')
			.setDescription(`Welcome to the Awesome Store!
			Here you can shop with the money you've acquired until now.
			Use \`${prefix}shop [category]\` to select a category.`)
			.addFields(
				{ name: 'HUDs', value: '\u200B' },
			);

		let hudEmbed,
			hudColorsEmbed,
			hudGamesEmbed,
			hudAnimeEmbed,
			hudCartoonEmbed,
			hudVocaloidsEmbed;

		const page = parseInt(args[2]) || 1;

		switch (option) {
		case 'buy':
			switch (args[1]) {
			case 'hud':
				args[2] = args[2].toLowerCase().replace(/[ ]/g, '_');
				refP.get().then(docP => {
					if (!docP.exists) {
						return message.reply(`you haven't created a profile yet! To create one use \`${prefix}profile create\`!`);
					}
					else {
						const bal = docP.get('balance'),
							itemName = args[2].toLowerCase(),
							cost = items.huds[itemName].price;

						if (!cost) {
							return message.reply('that item isn\'t for sale!');
						}
						else {
							refI.get().then(docI => {
								const iHuds = docI.get('huds');

								if (iHuds.includes(itemName)) {
									return message.reply('you already own that HUD!');
								}
								else if (cost > bal) {
									return message.reply('you don\'t have enough money!');
								}
								else {
									iHuds.push(itemName);

									refP.update({
										balance: (bal - cost),
									});

									refI.update({
										huds: iHuds,
									}).then(() => {
										let name = itemName.toLowerCase().replace(/[_]/g, ' ');
										message.reply(`you bought the **${titleCase(name)}** HUD!`);
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
				let hud = '';
				hud = hud.concat(args.slice(2)).toLowerCase().replace(/[,]/g, '_');
				sendPreview(hud);
				break;
			}
			break;
		case 'huds':
			switch (args [1]) {
			case 'cores':
				hudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Awesome Store - HUDs (Colors)')
					.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Black', value: `Price ¤${items.huds.black.price}`, inline: true },
						{ name: 'Blue', value: `Price ¤${items.huds.blue.price}`, inline: true },
						{ name: 'Brown', value: `Price ¤${items.huds.brown.price}`, inline: true },
						{ name: 'Green', value: `Price ¤${items.huds.green.price}`, inline: true },
						{ name: 'Orange', value: `Price ¤${items.huds.orange.price}`, inline: true },
						{ name: 'Pink', value: `Price ¤${items.huds.pink.price}`, inline: true },
						{ name: 'Purple', value: `Price ¤${items.huds.purple.price}`, inline: true },
						{ name: 'Red', value: `Price ¤${items.huds.red.price}`, inline: true },
						{ name: 'Yellow', value: `Price ¤${items.huds.yellow.price}`, inline: true },
					]);
				message.channel.send(hudColorsEmbed);
				break;
			case 'games':
				switch (page) {
				case 2:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Awesome Store - HUDs (Games)')
						.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.\nTo change the page use \`shop huds games [page]\``)
						.setFooter('Página 2 de 3')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Glitchtrap', value: `Five Nights at Freddy's\nPrice ¤${items.huds.glitchtrap.price}`, inline: true },
							{ name: 'KDA Akali', value: `League of Legends\nPrice ¤${items.huds.kda_akali.price}`, inline: true },
							{ name: 'Kirby1', value: `Nintendo\nPrice ¤${items.huds.kirby1.price}`, inline: true },
							{ name: 'Kirby2', value: `Nintendo\nPrice ¤${items.huds.kirby2.price}`, inline: true },
							{ name: 'Nathan Drake', value: `Uncharted\nPrice ¤${items.huds.nightmare_chica.price}`, inline: true },
							{ name: 'Nightmare Chica', value: `Five Nights at Freddy's\nPrice ¤${items.huds.nightmare_chica.price}`, inline: true },
							{ name: 'Nightmare Foxy', value: `Five Nights at Freddy's\nPrice ¤${items.huds.nightmare_foxy.price}`, inline: true },
							{ name: 'Nunu and Willump', value: `League of Legends\nPrice ¤${items.huds.nightmare_foxy.price}`, inline: true },
							{ name: 'Reaper Soraka', value: `League of Legends\nPrice ¤${items.huds.reaper_soraka.price}`, inline: true },
						]);
					break;
				case 3:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Awesome Store - HUDs (Games)')
						.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.\nTo change the page use \`shop huds games [page]\``)
						.setFooter('Página 3 de 3')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Sans', value: `Undertale\nPrice ¤${items.huds.sans.price}`, inline: true },
							{ name: 'Scorpion2', value: `Mortal Kombat\nPrice ¤${items.huds.scorpion1.price}`, inline: true },
							{ name: 'Springtrap', value: `Five Nights at Freddy's\nPrice ¤${items.huds.springtrap.price}`, inline: true },
							{ name: 'SubZero', value: `Mortal Kombat\nPrice ¤${items.huds.subzero.price}`, inline: true },
							{ name: 'The Hillbilly', value: `Dead by Daylight\nPrice ¤${items.huds.dbd1.price}`, inline: true },
						]);
					break;
				default:
					hudGamesEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Awesome Store - HUDs (Games)')
						.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.\nTo change the page use \`shop huds games [page]\``)
						.setFooter('Página 1 de 3')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Among Us', value: `\nPrice ¤${items.huds.among_us.price}`, inline: true },
							{ name: 'Clown Gremlins', value: `Dark Deception\nPrice ¤${items.huds.dark_deception6.price}`, inline: true },
							{ name: 'Ditto', value: `Pokémon\nPrice ¤${items.huds.ditto.price}`, inline: true },
							{ name: 'Diamonds', value: `Minecraft\nPrice ¤${items.huds.diamonds.price}`, inline: true },
							{ name: 'Eclipse Leona', value: `League of Legends\nPrice ¤${items.huds.eclipse_leona.price}`, inline: true },
							{ name: 'Flappy Bird', value: `\nPrice ¤${items.huds.flappy_bird.price}`, inline: true },
							{ name: 'Funtime Foxy', value: `Five Nights at Freddy's\nPrice ¤${items.huds.funtime_foxy.price}`, inline: true },
							{ name: 'Murder Monkeys', value: `Dark Deception\nPrice ¤${items.huds.dark_deception1.price}`, inline: true },
							{ name: 'Scorpion1', value: `Mortal Kombat\nPrice ¤${items.huds.scorpion1.price}`, inline: true },
						]);
					break;
				}
				message.channel.send(hudGamesEmbed);
				break;
			case 'anime':
				switch (page) {
				case 2:
					hudAnimeEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Awesome Store - HUDs (Anime)')
						.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.\nTo change the page use \`shop huds anime [page]\``)
						.setFooter('Página 2 de 2')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'L', value: `Death Note\nPrice ¤${items.huds.l.price}`, inline: true },
							{ name: 'Lelouch1', value: `Code Geass\nPrice ¤${items.huds.lelouch1.price}`, inline: true },
							{ name: 'Lelouch2', value: `Code Geass\nPrice ¤${items.huds.lelouch2.price}`, inline: true },
							{ name: 'Shiro', value: `No Game No Life\nPrice ¤${items.huds.sora_shiro.price}`, inline: true },
							{ name: 'Sora Shiro', value: `No Game No Life\nPrice ¤${items.huds.sora_shiro.price}`, inline: true },
							{ name: 'Yukiteru Yuno', value: `Mirai Nikki\nPrice ¤${items.huds.yukiteru_yuno.price}`, inline: true },
							{ name: 'Yuno', value: `Mirai Nikki\nPrice ¤${items.huds.yukiteru_yuno.price}`, inline: true },
						]);
					break;
				default:
					hudAnimeEmbed = new MessageEmbed(mainEmbed)
						.setTitle('Awesome Store - HUDs (Anime)')
						.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.\nTo change the page use \`shop huds anime [page]\``)
						.setFooter('Página 1 de 2')
						.spliceFields(0, mainEmbed.fields.length, [
							{ name: 'Giorno', value: `Jojo's Bizarre Adventure\nPrice ¤${items.huds.giorno.price}`, inline: true },
							{ name: 'Isaac', value: `Angel's of Death\nPrice ¤${items.huds.isaac.price}`, inline: true },
							{ name: 'Itachi', value: `Naruto\nPrice ¤${items.huds.itachi.price}`, inline: true },
							{ name: 'Jojo Part4', value: `Jojo's Bizarre Adventure\nPrice ¤${items.huds.jojo_part4.price}`, inline: true },
							{ name: 'Kakashi', value: `Naruto\nPrice ¤${items.huds.kakashi.price}`, inline: true },
							{ name: 'Kaneki1', value: `Tokyo Ghoul\nPrice ¤${items.huds.kaneki1.price}`, inline: true },
							{ name: 'Kaneki2', value: `Tokyo Ghoul\nPrice ¤${items.huds.kaneki2.price}`, inline: true },
							{ name: 'Naruto1', value: `Naruto\nPrice ¤${items.huds.naruto1.price}`, inline: true },
							{ name: 'Nezuko Kamado', value: `Naruto\nPrice ¤${items.huds.naruto1.price}`, inline: true },
						]);
					break;
				}
				message.channel.send(hudAnimeEmbed);
				break;
			case 'cartoon':
				hudCartoonEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Awesome Store - HUDs (Cartoon)')
					.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Courage', value: `Courage the Cowardly Dog\nPrice ¤${items.huds.courage.price}`, inline: true },
						{ name: 'Jake1', value: `Adventure Time\nPrice ¤${items.huds.jake1.price}`, inline: true },
						{ name: 'Jake2', value: `Adventure Time\nPrice ¤${items.huds.jake2.price}`, inline: true },
						{ name: 'Gumball Darwin', value: `The Amazing World of Gumball\nPrice ¤${items.huds.gumball_darwin.price}`, inline: true },
					]);
				message.channel.send(hudCartoonEmbed);
				break;
			case 'vocaloids':
				hudVocaloidsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Awesome Store - HUDs (Cartoon)')
					.setDescription(`\`${prefix}shop buy hud [Item Name]\` to buy or \`${prefix}shop view hud [item]\` to take a look.`)
					.setFooter('Página 1 de 1')
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Miku', value: `Price ¤${items.huds.miku.price}`, inline: true },
					]);
				message.channel.send(hudVocaloidsEmbed);
				break;
			default:
				hudEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Awesome Store - HUDs')
					.setDescription(`\`${prefix}shop huds [sub-category]\` to select a sub-category.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Cores', value: '\u200B', inline: true },
						{ name: 'Games', value: '\u200B', inline: true },
						{ name: 'Anime', value: '\u200B', inline: true },
						{ name: 'Cartoon', value: '\u200B', inline: true },
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