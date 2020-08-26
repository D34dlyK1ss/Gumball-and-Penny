const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'inventory',
	aliases: ['i'],
	category: 'Perfil',
	description: 'Verifica o teu inventario',
	usage: '`+inventory`',

	execute(bot, message, command, args, db) {
		const refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id),
			iEmbed = new MessageEmbed()
				.setColor('#8000ff')
				.setTitle(`inventario de ${message.author.tag}`)
				.setThumbnail(`${message.author.displayAvatarURL()}`);

		refP.get().then(docP => {
			if (!docP.exists) {
				message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else {
				refI.get().then(docI => {
					if (!docI.exists) {
						message.reply('não conseguimos encontrar o teu inventario!');
					}
					else {
						const iHuds = docI.get('huds');
						const allHuds = `\`${iHuds.join('`, `')}\``;

						const newIEmbed = new MessageEmbed (iEmbed)
							.addFields(
								{ name: 'HUDs', value: `${allHuds}`, inline: true },
							);
						message.channel.send(newIEmbed);
					}
				});
			}
		});
	},
};