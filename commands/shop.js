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
			Usa as reações para selecionares uma categoria.`)
				.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
				.addFields(
					{ name: 'A - HUD', value: '\u200B' },
					{ name: '\u200B', value: 'Em breve serão adicionadas mais categorias.' },
				);

		const hudEmbed = new MessageEmbed(mainEmbed)
			.setTitle('Loja - HUD (Cores)')
			.setDescription('`+shop buy hud [item]` para comprar.')
			.spliceFields(0, 2, [
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
			.setTitle('Loja - HUD (Anime)')
			.spliceFields(0, 10, [
				{ name: 'Giorno', value: `¤${huds.giorno}`, inline: true },
				{ name: 'Jojo4', value: `¤${huds.jojo4}`, inline: true },
				{ name: 'L', value: `¤${huds.l}`, inline: true },
				{ name: 'Lelouch', value: `¤${huds.lelouch}`, inline: true },
			]);

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
		default:
			message.channel.send(mainEmbed).then(async msg => {
				try {
					msg.react('🇦');
				}
				catch {
					return;
				}

				const hudF = (reaction, member) => reaction.emoji.name == '🇦' && member.id === message.author.id,
					PrevF = (reaction, member) => reaction.emoji.name == ('⬅️') && member.id === message.author.id,
					NextF = (reaction, member) => reaction.emoji.name == ('➡️') && member.id === message.author.id,
					mainF = (reaction, member) => reaction.emoji.name == '↩️' && member.id === message.author.id;

				let page = 0;

				const main = msg.createReactionCollector(mainF, { time: 60000 }),
					hud = msg.createReactionCollector(hudF, { time: 60000 }),
					PrevPage = msg.createReactionCollector(PrevF, { time: 60000 }),
					NextPage = msg.createReactionCollector(NextF, { time: 60000 });

				let onMain = true,
					onHud = false;

				main.on('collect', async () => {
					if (onMain == true) return;
					onMain = true;
					msg.reactions.removeAll();
					msg.edit(mainEmbed);
					msg.react('🇦');
				});

				hud.on('collect', async () => {
					if (onMain == false) return;
					onMain = false;
					onHud = true;
					msg.reactions.removeAll();
					msg.edit(hudEmbed);
					msg.react('⬅️');
					await msg.react('➡️');
					await msg.react('↩️');
				});

				PrevPage.on('collect', async () => {
					if (onHud == true) {
						if ((page--) < 0) {
							return;
						}
						else {
							page--;
							msg.edit(hudEmbed);
						}
					}
					else {
						return;
					}
				});

				NextPage.on('collect', async () => {
					if (onHud == true) {
						if ((page++) > 1) {
							return;
						}
						else {
							page++;
							msg.edit(hudAnimeEmbed);
						}
					}
					else {
						return;
					}
				});
			});
			break;
		}
	},
};