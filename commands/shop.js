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
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
			.setColor('#8000ff')
			.setTitle('Loja')
			.setDescription(`Bem vindo à nossa loja!
			Aqui poderás comprar algumas coisas com o dinheiro que acumulaste até agora.
			Usa \`+shop [número]\` para selecionares uma categoria.`)
			.addFields(
				{ name: '1 - Imagens de Fundo', value: '\u200B' },
				{ name: '2 - HUD', value: '\u200B' },
			);

		message.channel.send(embed);
	},
};