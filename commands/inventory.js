const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'inventory',
	aliases: ['i'],
	category: 'Perfil',
	description: 'Verifica o teu inventário',
	usage: 'inventory',

	execute(bot, message, command, args, db, prefix) {
		const refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id),
			iEmbed = new MessageEmbed()
				.setColor('#8000ff')
				.setTitle(`Inventário de ${message.author.tag}`)
				.setThumbnail(`${message.author.displayAvatarURL()}`);

		refP.get().then(docP => {
			if (!docP.exists) {
				return message.reply(`ainda não criaste um perfil! Para criares um perfil usa \`${prefix}profile create\`!`);
			}
			else {
				refI.get().then(docI => {
					if (!docI.exists) {
						return message.reply('não tens nenhum inventário!');
					}
					else {
						let iHuds = docI.get('huds');
						iHuds.sort();
						iHuds = iHuds.map(s => s.replace(/[_]/g, ' '));
						const allHuds = `\`${iHuds.join('`, `')}\``,
							newIEmbed = new MessageEmbed (iEmbed)
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