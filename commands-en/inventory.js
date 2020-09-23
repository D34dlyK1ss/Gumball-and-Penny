const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'inventory',
	aliases: ['i'],
	category: 'Profile',
	description: 'Check your inventory!',
	usage: 'inventory',

	execute(bot, message, command, args, db, prefix) {
		const refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id),
			iEmbed = new MessageEmbed()
				.setColor('#8000ff')
				.setTitle(`${message.author.tag}'s Inventory`)
				.setThumbnail(`${message.author.displayAvatarURL()}`);

		refP.get().then(docP => {
			if (!docP.exists) {
				return message.reply(`you haven't created a profile yet! To create one use \`${prefix}profile create\`!`);
			}
			else {
				refI.get().then(docI => {
					if (!docI.exists) {
						return message.reply('there\'s no inventory!');
					}
					else {
						const iHuds = docI.get('huds');
						iHuds.sort();

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