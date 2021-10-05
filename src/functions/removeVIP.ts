import { Guild, Role } from 'discord.js';
import { BotClient } from 'index';

async function removeVIP(admin: any, bot: BotClient, db: FirebaseFirestore.Firestore, vips: Set<string>) {
	const refV = db.collection('vip');
	const timestamp = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 86400000));
	const snapshot = await refV.where('until', '<', timestamp).get();

	if (!snapshot.empty) {
		snapshot.forEach(async doc => {
			const until = doc.get('until');

			if (until !== 'forever') {
				const officialServer = bot.guilds.cache.get('738540548305977366') as Guild;
				const memberToVIP = await officialServer.members.fetch(doc.id), vipRole = officialServer.roles.cache.find(role => role.name === 'VIP') as Role;
				const ms = until._seconds * 1000 - Date.now();

				vips.add(doc.id);
				setTimeout(async () => {
					memberToVIP.roles.remove(vipRole);
					vips.delete(doc.id);
					await refV.doc(doc.id).delete();
				}, ms);
			}
		});
	}
}

export default removeVIP;