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
				.setThumbnail(`${message.author.displayAvatarURL()}`);

		refP.get().then(docP => {
			if (!docP.exists) {
				message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else {
				refI.get().then(docI => {
					let iHuds = docI.get('huds');

					iHuds = `\`${iHuds.join('`, `')}\``;

					const newIEmbed = new MessageEmbed (iEmbed)
						.addfields(
							{ name: 'HUDs', value: `${iHuds}`, inline: true },
						);
					message.channel.send(newIEmbed);
				});
			}
		});
	},
};