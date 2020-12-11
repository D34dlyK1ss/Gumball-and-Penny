const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'inventory',
	aliases: ['i'],

	execute(bot, message, command, db, lang, language, supportServer, prefix) {
		const refP = db.collection('perfis').doc(message.author.id),
			refI = db.collection('inventario').doc(message.author.id);
		let iEmbed = new MessageEmbed()
			.setColor('#8000ff')
			.setTitle(`Inventário de ${message.author.tag}`)
			.setThumbnail(`${message.author.displayAvatarURL()}`);

		refP.get().then(docP => {
			if (!docP.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
			}
			else {
				refI.get().then(async docI => {
					let iHuds = docI.get('huds'),
						iPetHuds = docI.get('petHuds'),
						iItems = docI.get('items');
					iHuds.sort();
					iHuds = iHuds.map(s => s.replace(/[_]/g, ' '));
					const allHuds = `\`${iHuds.join('`, `')}\``;
					iEmbed = new MessageEmbed (iEmbed)
						.addFields(
							{ name: 'HUDs', value: `${allHuds}`, inline: true },
						);

					if (!docI.exists) {
						return message.reply(lang.error.noInventory).catch();
					}

					if (iPetHuds) {
						iPetHuds.sort();
						iPetHuds = iPetHuds.map(s => s.replace(/[_]/g, ' '));
						const allPetHuds = `\`${iPetHuds.join('`, `')}\``;
						iEmbed = new MessageEmbed (iEmbed)
							.addFields(
								{ name: 'Pet HUDs', value: `${allPetHuds}` },
							);
					}

					if (iItems) {
						iItems.sort();
						iItems = iItems.map(s => s.replace(/[_]/g, ' '));
						const allItems = `\`${iItems.join('`, `')}\``;
						iEmbed = new MessageEmbed (iEmbed)
							.addFields(
								{ name: 'Items', value: `${allItems}` },
							);
					}

					await message.channel.send(iEmbed).catch();
				});
			}
		});
	},
};