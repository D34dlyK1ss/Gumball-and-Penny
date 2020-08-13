/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'shop',
	aliases: ['s'],
	category: 'Perfil',
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
			Usa \`+shop [número]\` para selecionares uma categoria.`)
				.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
				.addFields(
					{ name: 'A - Imagens de Fundo', value: '\u200B' },
					{ name: 'B - HUD', value: '\u200B' },
				);
		const aEmbed = new MessageEmbed(mainEmbed)
				.spliceFields(0, 2, [
					{ name: 'N/A', value: '\u200B' },
				])
				.setTitle('Loja - Imagens de Fundo')
				.setDescription('`+shop background [item]` para comprar.')
				.addFields(

				),
			bEmbed = new MessageEmbed(mainEmbed)
				.spliceFields(0, 2, [
					{ name: 'Amarelo', value: '¤1500', inline: true },
					{ name: 'Azul', value: '¤1500', inline: true },
					{ name: 'Cinzento', value: '¤1500', inline: true },
					{ name: 'Branco', value: '¤1500', inline: true },
					{ name: 'Castanho', value: '¤1500', inline: true },
					{ name: 'Laranja', value: '¤1500', inline: true },
					{ name: 'Preto', value: '¤1500', inline: true },
					{ name: 'Rosa', value: '¤1500', inline: true },
					{ name: 'Roxo', value: '¤1500', inline: true },
					{ name: 'Verde', value: '¤1500', inline: true },
					{ name: 'Vermelho', value: '¤1500', inline: true },
				])
				.setTitle('Loja - HUD')
				.setDescription('`+shop hud [item]` para comprar.');

		switch (option) {
		case 'hud':
			refP.get().then(docP => {
				if (!docP.exists) {
					message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
				}
				else {
					const bal = docP.get('balance'),
						item = bEmbed.find(thing => thing.name == args[1].toLowerCase());
					let cost = bEmbed.find(() => item.value);
					cost.substring(1);
					cost = parseInt(cost);

					if (cost > bal) {
						message.reply('Não tens dinheiro suficiente!');
					}
					else {
						refI.get().then(docI => {
							if (!docI.exists) {
								refI.set({
									backgrounds: [],
									huds: [],
								});
							}

							const huds = docI.get('huds');

							refP.update({
								balance: (bal - cost),
							});

							refI.update({
								huds: huds.push(item),
							});
						});
					}
				}
			});
			break;
		default:
			message.channel.send(mainEmbed).then(async msg => {
				try {
					msg.react('🇦');
					await msg.react('🇧');
				}
				catch {
					return;
				}

				const aF = (reaction, member) => reaction.emoji.name == '🇦' && member.id === message.author.id,
					bF = (reaction, member) => reaction.emoji.name == '🇧' && member.id === message.author.id,
					mainF = (reaction, member) => reaction.emoji.name == '↩️' && member.id === message.author.id;

				const a = msg.createReactionCollector(aF, { time: 60000 }),
					b = msg.createReactionCollector(bF, { time: 60000 }),
					main = msg.createReactionCollector(mainF, { time: 60000 });

				let onMain = true;

				a.on('collect', async reaction => {
					if (onMain == false) return;
					onMain = false;
					msg.reactions.removeAll();
					msg.edit(aEmbed);
					msg.react('↩️');
				});

				b.on('collect', async reaction => {
					if (onMain == false) return;
					onMain = false;
					msg.reactions.removeAll();
					msg.edit(bEmbed);
					msg.react('↩️');
				});

				main.on('collect', async reaction => {
					if (onMain == true) return;
					onMain = true;
					msg.reactions.removeAll();
					msg.edit(mainEmbed);
					msg.react('🇦');
					await msg.react('🇧');
				});
			});
			break;
		}
	},
};