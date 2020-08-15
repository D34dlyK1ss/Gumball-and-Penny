const { MessageEmbed } = require('discord.js');
const { huds } = require('../pricelist.json');

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

		const hudEmbed = new MessageEmbed(mainEmbed)
				.setTitle('Loja - HUDs')
				.setDescription('`+shop huds [sub-categoria]` para selecionares uma sub-categoria.')
				.spliceFields(0, 2, [
					{ name: 'Cores', value: '\u200B', inline: true },
					{ name: 'Anime', value: '\u200B', inline: true },
					{ name: 'Jogos', value: '\u200B', inline: true },
					{ name: 'Cartoons', value: '\u200B', inline: true },
				]),

			hudColorsEmbed = new MessageEmbed(hudEmbed)
				.setTitle('Loja - HUDs (Cores)')
				.setDescription('`+shop buy hud [item]` para comprar.')
				.spliceFields(0, 3, [
					{ name: 'Black', value: `¤${huds.black}`, inline: true },
					{ name: 'Blue', value: `¤${huds.blue}`, inline: true },
					{ name: 'Brown', value: `¤${huds.brown}`, inline: true },
					{ name: 'Green', value: `¤${huds.green}`, inline: true },
					{ name: 'Orange', value: `¤${huds.orange}`, inline: true },
					{ name: 'Pink', value: `¤${huds.pink}`, inline: true },
					{ name: 'Purple', value: `¤${huds.purple}`, inline: true },
					{ name: 'Red', value: `¤${huds.red}`, inline: true },
					{ name: 'White', value: `¤${huds.white}`, inline: true },
					{ name: 'Yellow', value: `¤${huds.yellow}`, inline: true },
				]);

		const hudAnimeEmbed = new MessageEmbed(hudEmbed)
				.setTitle('Loja - HUDs (Anime)')
				.setDescription('`+shop buy hud [item]` para comprar.')
				.spliceFields(0, 3, [
					{ name: 'Giorno', value: `¤${huds.giorno}`, inline: true },
					{ name: 'Jojo_Part4', value: `¤${huds.jojo_part4}`, inline: true },
					{ name: 'L', value: `¤${huds.l}`, inline: true },
					{ name: 'Lelouch1', value: `¤${huds.lelouch1}`, inline: true },
					{ name: 'Lelouch2', value: `¤${huds.lelouch2}`, inline: true },
				]),

			hudGamesEmbed = new MessageEmbed(hudEmbed)
				.setTitle('Loja - HUDs (Jogos)')
				.setDescription('`+shop buy hud [item]` para comprar.')
				.spliceFields(0, 3, [
					{ name: 'KDA_Akali', value: `¤${huds.kda_akali}`, inline: true },
				]),
				
			hudCartoonsEmbed = new MessageEmbed(hudEmbed)
				.setTitle('Loja - HUDs (Cartoons)')
				.setDescription('`+shop buy hud [item]` para comprar.')
				.spliceFields(0, 3, [
					{ name: 'Gumball1', value: `¤${huds.gumball1}`, inline: true },
				]),;

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
							cost = huds[itemName];

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
				message.channel.send(hudColorsEmbed);
				break;
			case 'anime':
				message.channel.send(hudAnimeEmbed);
				break;
			case 'jogos':
				message.channel.send(hudGamesEmbed);
				break;
			case 'cartoons':
				message.channel.send(hudCartoonsEmbed);
				break;
			default:
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