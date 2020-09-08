const { MessageEmbed, MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const items = require('../itemlist.json');

module.exports = {
	name: 'shop',
	aliases: ['s'],
	category: 'Economia e Perfil',
	description: 'Faz compras na Loja Incrível!',
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
				message.reply('esse HUD não existe!');
			}

		}

		const option = args[0],
			refP = db.collection('perfis').doc(message.author.id),
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
			);

		let hudEmbed,
			hudColorsEmbed,
			hudGamesEmbed,
			hudAnimeEmbed,
			hudCartoonsEmbed,
			hudVocaloidsEmbed;

		switch (option) {
		case 'buy':
			switch (args[1]) {
			case 'hud':
				refP.get().then(docP => {
					if (!docP.exists) {
						message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
					}
					else {
						const bal = docP.get('balance'),
							itemName = args[2].toLowerCase(),
							cost = items.huds[itemName].price;

						if (!cost) {
							message.reply('esse item não está à venda!');
						}
						else {
							refI.get().then(docI => {
								const iHuds = docI.get('huds');

								if (iHuds.includes(itemName)) {
									message.reply('já tens este HUD!');
								}
								else if (cost > bal) {
									message.reply('não tens dinheiro suficiente!');
								}
								else {
									iHuds.push(itemName);

									refP.update({
										balance: (bal - cost),
									});

									refI.update({
										huds: iHuds,
									}).then(() => {
										message.reply(`compraste o HUD **${itemName.charAt(0).toUpperCase() + itemName.slice(1)}**`);
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
				sendPreview(args[2]);
				break;
			}
			break;
		case 'huds':
			switch (args [1]) {
			case 'cores':
				hudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Cores)')
					.setDescription(`\`${prefix}shop buy hud [item]\` para comprar ou \`${prefix}shop view hud [item]\` para ver.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Black', value: `¤${items.huds.black.price}`, inline: true },
						{ name: 'Blue', value: `¤${items.huds.blue.price}`, inline: true },
						{ name: 'Brown', value: `¤${items.huds.brown.price}`, inline: true },
						{ name: 'Green', value: `¤${items.huds.green.price}`, inline: true },
						{ name: 'Orange', value: `¤${items.huds.orange.price}`, inline: true },
						{ name: 'Pink', value: `¤${items.huds.pink.price}`, inline: true },
						{ name: 'Purple', value: `¤${items.huds.purple.price}`, inline: true },
						{ name: 'Red', value: `¤${items.huds.red.price}`, inline: true },
						{ name: 'Yellow', value: `¤${items.huds.yellow.price}`, inline: true },
					]);
				message.channel.send(hudColorsEmbed);
				break;
			case 'jogos':
				hudGamesEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Jogos)')
					.setDescription(`\`${prefix}shop buy hud [item]\` para comprar.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Ditto', value: `¤${items.huds.ditto.price}`, inline: true },
						{ name: 'Diamonds', value: `¤${items.huds.diamonds.price}`, inline: true },
						{ name: 'Eclipse_Leona', value: `¤${items.huds.eclipse_leona.price}`, inline: true },
						{ name: 'Flappy_Bird', value: `¤${items.huds.flappy_bird.price}`, inline: true },
						{ name: 'Glitchtrap', value: `¤${items.huds.glitchtrap.price}`, inline: true },
						{ name: 'KDA_Akali', value: `¤${items.huds.kda_akali.price}`, inline: true },
						{ name: 'Kirby1', value: `¤${items.huds.kirby1.price}`, inline: true },
						{ name: 'Kirby2', value: `¤${items.huds.kirby2.price}`, inline: true },
						{ name: 'Nightmare_Chica', value: `¤${items.huds.nightmare_chica.price}`, inline: true },
						{ name: 'Nightmare_Foxy', value: `¤${items.huds.nightmare_foxy.price}`, inline: true },
						{ name: 'Scorpion1', value: `¤${items.huds.scorpion1.price}`, inline: true },
						{ name: 'Scorpion2', value: `¤${items.huds.scorpion1.price}`, inline: true },
						{ name: 'Springtrap', value: `¤${items.huds.springtrap.price}`, inline: true },
					]);
				message.channel.send(hudGamesEmbed);
				break;
			case 'anime':
				hudAnimeEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Anime)')
					.setDescription(`\`${prefix}shop buy hud [item]\` para comprar.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Giorno', value: `¤${items.huds.giorno.price}`, inline: true },
						{ name: 'Isaac', value: `¤${items.huds.isaac.price}`, inline: true },
						{ name: 'Itachi', value: `¤${items.huds.itachi.price}`, inline: true },
						{ name: 'Jojo_Part4', value: `¤${items.huds.jojo_part4.price}`, inline: true },
						{ name: 'Kakashi', value: `¤${items.huds.kakashi.price}`, inline: true },
						{ name: 'Kaneki1', value: `¤${items.huds.kaneki1.price}`, inline: true },
						{ name: 'Kaneki2', value: `¤${items.huds.kaneki2.price}`, inline: true },
						{ name: 'Naruto1', value: `¤${items.huds.naruto1.price}`, inline: true },
						{ name: 'L', value: `¤${items.huds.l.price}`, inline: true },
						{ name: 'Lelouch1', value: `¤${items.huds.lelouch1.price}`, inline: true },
						{ name: 'Lelouch2', value: `¤${items.huds.lelouch2.price}`, inline: true },
						{ name: 'Sora_Shiro', value: `¤${items.huds.sora_shiro.price}`, inline: true },
						{ name: 'Yukiteru_Yuno', value: `¤${items.huds.yukiteru_yuno.price}`, inline: true },
						{ name: 'Yuno', value: `¤${items.huds.yukiteru_yuno.price}`, inline: true },
					]);
				message.channel.send(hudAnimeEmbed);
				break;
			case 'cartoons':
				hudCartoonsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Cartoons)')
					.setDescription(`\`${prefix}shop buy hud [item]\` para comprar.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Courage', value: `¤${items.huds.courage.price}`, inline: true },
						{ name: 'Jake1', value: `¤${items.huds.jake1.price}`, inline: true },
						{ name: 'Jake2', value: `¤${items.huds.jake2.price}`, inline: true },
						{ name: 'Gumball_Darwin', value: `¤${items.huds.gumball_darwin.price}`, inline: true },
					]);
				message.channel.send(hudCartoonsEmbed);
				break;
			case 'Vocaloids':
				hudVocaloidsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja Incrível - HUDs (Cartoons)')
					.setDescription(`\`${prefix}shop buy hud [item]\` para comprar.`)
					.spliceFields(0, mainEmbed.fields.length, [
						{ name: 'Miku', value: `¤${items.huds.miku.price}`, inline: true },
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