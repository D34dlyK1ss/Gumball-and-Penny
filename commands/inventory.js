const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'inventory',
	aliases: ['i'],
	category: 'Perfil',
	description: 'Verifica o teu inventário',
	usage: '`+inventory`',

	execute(bot, message, command, args, db) {
		const refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventário').doc(message.author.id),
			iEmbed = new MessageEmbed()
				.setColor('#8000ff')
				.setTitle(`Inventário de ${message.author.tag}`)
				.setThumbnail(`${message.author.displayAvatarURL()}`)
				.addFields(
					{ name: 'HUDs', value: 'Nenhum', inline: true },
					{ name: 'Imagens de Fundo', value: 'Nenhuma', inline: true },
				);

		refP.get().then(docP => {
			if (!docP.exists) {
				message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else {
				refI.get().then(docI => {
					let iHuds = docI.get('huds'),
						iBackgrounds = docI.get('backgrounds');

					if (!iHuds || iHuds == '')	{
						iHuds = 'Nenhum';
					}
					else {
						iHuds = `\`${iHuds.join('`, `')}\``;
					}

					if (!iBackgrounds || iBackgrounds == '')	{
						iBackgrounds = 'Nenhuma';
					}
					else {
						iBackgrounds = `\`${iBackgrounds.join('`, `')}\``;
					}

					const newIEmbed = new MessageEmbed (iEmbed)
						.spliceFields(0, 2, [
							{ name: 'HUDs', value: `${iHuds}`, inline: true },
							{ name: 'Imagens de Fundo', value: `${iBackgrounds}`, inline: true },
						]);
					message.channel.send(newIEmbed);
				});
			}
		});
	},
};