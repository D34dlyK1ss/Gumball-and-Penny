import { BotClient } from 'index';

async function removeVIP(admin: any, bot: BotClient, db: FirebaseFirestore.Firestore, vips: Set<string>) {
	const refV = db.collection('vip');
	const timestamp = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 86400000));
	const snapshot = await refV.where('until', '<', timestamp).get();

	if (!snapshot.empty) {
		snapshot.forEach(doc => {
			const until = doc.get('until');

			if (until !== 'forever') {
				const ms = until._seconds * 1000 - Date.now();

				vips.add(doc.id);
				setTimeout(async () => {
					vips.delete(doc.id);
					await refV.doc(doc.id).delete();
				}, ms);
			}
		});
	}
}

export default removeVIP;