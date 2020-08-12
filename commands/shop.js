/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
	name: 'shop',
	aliases: ['s'],
	category: 'Economia',
	description: 'Vai às compras!',
	usage: '`+shop`',

	execute(bot, message, command, args, db) {
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
			.setColor('#8000ff')
			.setTitle('Loja')
			.setDescription('Bem vindo à nossa loja!\nAqui poderás comprar algumas coisas com o dinheiro que acumulaste até agora.\n Usa `+shop [número]` para selecionares uma categoria.')
			.addFields(
				{ name: '1', value: 'Perfil' },
			);
	},
};