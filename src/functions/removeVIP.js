async function removeVIP(admin, bot, db, vips) {
	const refV = db.collection('vip');
	const timestamp = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 86400000));
	const snapshot = await refV.where('until', '<', timestamp).get();

	if (!snapshot.empty) {
		snapshot.forEach(doc => {
			const until = doc.get('until');

			if (until != 'forever') {
				const officialServer = bot.guilds.cache.get('738540548305977366');
				const memberToVIP = officialServer.member(doc.id),
					vipRole = officialServer.roles.cache.find(role => role.name === 'VIP'),
					ms = (until._seconds * 1000) - Date.now();

				vips.add(doc.id);
				setTimeout(async () => {
					memberToVIP.roles.remove(vipRole);
					vips.delete(doc.id);
					refV.doc(doc.id).delete();
				}, ms);
			}
		});
	}
}

module.exports = removeVIP;