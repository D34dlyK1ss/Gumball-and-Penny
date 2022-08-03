import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription(enLang.command.inventory.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const refP = db.collection('perfis').doc(interaction.user.id);
		const refI = db.collection('inventario').doc(interaction.user.id);
		let iEmbed = new EmbedBuilder()
			.setColor('DarkPurple')
			.setTitle(getText(lang.command.inventory.inventoryFrom, [interaction.user.tag]))
			.setThumbnail(interaction.user.displayAvatarURL());

		refP.get().then(docP => {
			if (!docP.exists) {
				interaction.reply(lang.error.noProfile);
			}
			else {
				refI.get().then(docI => {
					const iHuds = docI.get('huds');
					const iPetHuds = docI.get('petHuds');
					const iItems = docI.get('items');
					iHuds.sort();
					const allHuds = `\`${iHuds.join('`, `')}\``;
					iEmbed = EmbedBuilder.from(iEmbed)
						.addFields(
							{ name: 'HUDs', value: `${allHuds}`, inline: true }
						);

					if (!docI.exists) {
						interaction.reply(lang.error.noInventory);
					}

					if (iPetHuds) {
						iPetHuds.sort();
						const allPetHuds = `\`${iPetHuds.join('`, `')}\``;
						iEmbed = EmbedBuilder.from(iEmbed)
							.addFields(
								{ name: 'Pet HUDs', value: `${allPetHuds}` }
							);
					}

					if (iItems) {
						iItems.sort();
						const allItems = `\`${iItems.join('`, `')}\``;
						iEmbed = EmbedBuilder.from(iEmbed)
							.addFields(
								{ name: 'Items', value: `${allItems}` }
							);
					}
		
					interaction.reply({ embeds: [iEmbed] });
				});
			}
		});
	}
};