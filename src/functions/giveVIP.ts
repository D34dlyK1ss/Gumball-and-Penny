import { Message } from "discord.js";

async function giveVIP(db: any, message: Message, args: string[]) {
	const refV = db.collection('vip').doc(message.author.id),
		timestamp = new Date(Date.now() + (2592000000)),
		vipRole = message.guild.roles.cache.find(role => role.name === 'VIP'),
		justPaidRole = message.guild.roles.cache.find(role => role.name === 'I Just Paid VIP');

	if (args !== undefined) {
		args.forEach(id => {
			db.collection('vip').doc(id).set({
				until: timestamp,
			});

			const memberToVIP = message.guild.member(id);

			memberToVIP.roles.remove(justPaidRole);
			memberToVIP.roles.add(vipRole);
		});

		let plural;

		args.length === 1 ? plural = ' é' : plural = 'es são';

		return message.channel.send(`${args.length} utilizador${plural} agora VIP por 1 mês!`).catch(err => { console.error(err); });
	}
	else {
		refV.get().then((doc: any) => {
			if (doc.exists) {
				message.react('❌').catch(err => { console.error(err); });
			}
			else {
				refV.set({
					until: timestamp,
				}).then(() => {
					const memberToVIP = message.guild.member(message.author.id);

					memberToVIP.roles.remove(justPaidRole);
					memberToVIP.roles.add(vipRole).then(() => { message.react('✅'); }).catch(err => { console.error(err); });
				});
			}
		});
	}
}

export default giveVIP;