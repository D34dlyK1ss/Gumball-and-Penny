import { Message } from 'discord.js';

async function giveVIP(db: FirebaseFirestore.Firestore, message: Message, args: string[]) {
	const refV = db.collection('vip').doc(message.author.id);
	const timestamp = new Date(Date.now() + 2592000000);
	const vipRole = message.guild.roles.cache.find(role => role.name === 'VIP');
	const justPaidRole = message.guild.roles.cache.find(role => role.name === 'I Just Paid VIP');

	if (args) {
		args.forEach(async id => {
			db.collection('vip').doc(id).set({
				until: timestamp
			});

			const memberToVIP = await message.guild.members.fetch(id).catch(() => undefined);

			if (memberToVIP) {
				memberToVIP.roles.remove(justPaidRole);
				memberToVIP.roles.add(vipRole);
			}
		});

		let plural;

		args.length === 1 ? plural = ' é' : plural = 'es são';

		return message.channel.send(`${args.length} utilizador${plural} agora VIP por 1 mês!`);
	}
	else {
		refV.get().then(doc => {
			if (doc.exists) {
				message.react('❌');
			}
			else {
				refV.set({
					until: timestamp
				}).then(async () => {
					const memberToVIP = await message.guild.members.fetch(message.author.id).catch(() => undefined);

					if (memberToVIP) {
						memberToVIP.roles.remove(justPaidRole);
						memberToVIP.roles.add(vipRole).then(() => { message.react('✅'); });
					}
				});
			}
		});

		return 0;
	}
}

export default giveVIP;