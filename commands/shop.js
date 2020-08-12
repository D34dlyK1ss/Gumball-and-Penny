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
		const mainShop = new MessageEmbed()
				.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
				.setColor('#8000ff')
				.setTitle('Loja')
				.setDescription(`Bem vindo à nossa loja!
			Aqui poderás comprar algumas coisas com o dinheiro que acumulaste até agora.
			Usa \`+shop [número]\` para selecionares uma categoria.`)
				.addFields(
					{ name: 'A - Imagens de Fundo', value: '\u200B' },
					{ name: 'B - HUD', value: '\u200B' },
				)
				.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`),
			aShop = new MessageEmbed()
				.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
				.setColor('#8000ff')
				.setTitle('Loja')
				.setDescription('Imagens de Fundo')
				.addFields(
					{ name: 'N/A', value: '\u200B' },
				)
				.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`),
			bShop = new MessageEmbed()
				.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
				.setColor('#8000ff')
				.setTitle('Loja')
				.setDescription('HUD')
				.addFields(
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
				)
				.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL()}`);

		message.channel.send(mainShop).then(async msg => {
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
				msg.reactions.removeAll();
				msg.edit(aShop);
				onMain = false;
				msg.react('↩️');
			});

			b.on('collect', async reaction => {
				if (onMain == false) return;
				msg.reactions.removeAll();
				msg.edit(bShop);
				onMain = false;
				msg.react('↩️');
			});

			main.on('collect', async reaction => {
				if (onMain == true) return;
				msg.reactions.removeAll();
				msg.edit(mainShop);
				onMain = true;
				msg.react('🇦');
				await msg.react('🇧');
			});
		});
	},
};