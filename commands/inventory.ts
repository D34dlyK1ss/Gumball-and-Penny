import { Message, MessageEmbed } from 'discord.js';

export const name = 'inventory';
export const aliases = ['i'];
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string, prefix: string) {
	const refP = db.collection('perfis').doc(message.author.id);
	const refI = db.collection('inventario').doc(message.author.id);
	let iEmbed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(`${lang.inventory.inventoryFrom}${message.author.tag}`)
		.setThumbnail(`${message.author.displayAvatarURL()}`);

	refP.get().then(docP => {
		if (!docP.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else {
			refI.get().then(docI => {
				let iHuds = docI.get('huds');
				let iPetHuds = docI.get('petHuds');
				let iItems = docI.get('items');
				iHuds.sort();
				iHuds = iHuds.map((s: string) => s.replace(/[_]/g, ' '));
				const allHuds = `\`${iHuds.join('`, `')}\``;
				iEmbed = new MessageEmbed(iEmbed)
					.addFields(
						{ name: 'HUDs', value: `${allHuds}`, inline: true }
					);

				if (!docI.exists) {
					message.reply(lang.error.noInventory).catch(err => { console.error(err); });
				}

				if (iPetHuds !== undefined) {
					iPetHuds.sort();
					iPetHuds = iPetHuds.map((s: string) => s.replace(/[_]/g, ' '));
					const allPetHuds = `\`${iPetHuds.join('`, `')}\``;
					iEmbed = new MessageEmbed(iEmbed)
						.addFields(
							{ name: 'Pet HUDs', value: `${allPetHuds}` }
						);
				}

				if (iItems !== undefined) {
					iItems.sort();
					iItems = iItems.map((s: string) => s.replace(/[_]/g, ' '));
					const allItems = `\`${iItems.join('`, `')}\``;
					iEmbed = new MessageEmbed(iEmbed)
						.addFields(
							{ name: 'Items', value: `${allItems}` }
						);
				}

				message.channel.send({ embeds: [iEmbed] }).catch((err: Error) => { console.error(err); });
			});
		}
	});
}