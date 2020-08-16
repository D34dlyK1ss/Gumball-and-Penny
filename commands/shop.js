const { MessageEmbed } = require('discord.js');
const items = require('../itemlist.json');

module.exports = {
	name: 'shop',
	aliases: ['s'],
	category: 'Economia e Perfil',
	description: 'Vai às compras!',
	usage: '`+shop`',

	execute(bot, message, command, args, db) {
		const option = args[0],
			refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventário').doc(message.author.id),
			mainEmbed = new MessageEmbed()
				.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
				.setColor('#8000ff')
				.setTitle('Loja')
				.setDescription(`Bem vindo à nossa loja!
			Aqui poderás comprar algumas coisas com o dinheiro que acumulaste até agora.
			Usa \`+shop [categoria]\` para selecionares uma categoria.`)
				.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
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
						message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
					else {
						const bal = docP.get('balance'),
							itemName = args[2].toLowerCase(),
							cost = items[itemName];

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
		case 'huds':
			switch (args [1]) {
			case 'cores':
				hudColorsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja - HUDs (Cores)')
					.setDescription('`+shop buy hud [item]` para comprar.')
					.spliceFields(0, 1, [
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
					.setTitle('Loja - HUDs (Jogos)')
					.setDescription('`+shop buy hud [item]` para comprar.')
					.spliceFields(0, 1, [
						{ name: 'Eclipse_Leona', value: `¤${items.huds.eclipse_leona.price}`, inline: true },
						{ name: 'Ditto', value: `¤${items.huds.ditto.price}`, inline: true },
						{ name: 'KDA_Akali', value: `¤${items.huds.kda_akali.price}`, inline: true },
						{ name: 'Kirby1', value: `¤${items.huds.kirby1.price}`, inline: true },
						{ name: 'Kirby2', value: `¤${items.huds.kirby2.price}`, inline: true },
					]);
				message.channel.send(hudGamesEmbed);
				break;
			case 'anime':
				hudAnimeEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja - HUDs (Anime)')
					.setDescription('`+shop buy hud [item]` para comprar.')
					.spliceFields(0, 1, [
						{ name: 'Giorno', value: `¤${items.huds.giorno.price}`, inline: true },
						{ name: 'Jojo_Part4', value: `¤${items.huds.jojo_part4.price}`, inline: true },
						{ name: 'L', value: `¤${items.huds.l.price}`, inline: true },
						{ name: 'Lelouch1', value: `¤${items.huds.lelouch1.price}`, inline: true },
						{ name: 'Lelouch2', value: `¤${items.huds.lelouch2.price}`, inline: true },
					]);
				message.channel.send(hudAnimeEmbed);
				break;
			case 'cartoons':
				hudCartoonsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja - HUDs (Cartoons)')
					.setDescription('`+shop buy hud [item]` para comprar.')
					.spliceFields(0, 1, [
						{ name: 'Gumball1', value: `¤${items.huds.gumball1.price}`, inline: true },
					]);
				message.channel.send(hudCartoonsEmbed);
				break;
			case 'Vocaloids':
				hudVocaloidsEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja - HUDs (Cartoons)')
					.setDescription('`+shop buy hud [item]` para comprar.')
					.spliceFields(0, 1, [
						{ name: 'Miku', value: `¤${items.huds.miku.price}`, inline: true },
					]);
				message.channel.send(hudVocaloidsEmbed);
				break;
			default:
				hudEmbed = new MessageEmbed(mainEmbed)
					.setTitle('Loja - HUDs')
					.setDescription('`+shop huds [sub-categoria]` para selecionares uma sub-categoria.')
					.spliceFields(0, 1, [
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
			message.channel.send(mainEmbed);
			break;
		}
	},
};