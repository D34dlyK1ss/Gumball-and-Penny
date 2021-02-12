async function removeVIP(admin, db, vips, officialServer, vipRole) {
	const refV = db.collection('vip');
	const timestamp = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 86400000));
	const snapshot = await refV.where('until', '<', timestamp).get();

	if (!snapshot.empty) {
		snapshot.forEach(doc => {
			const until = doc.get('until');

			if (until != 'forever') {
				const ms = (until._seconds * 1000) - Date.now();
				vips.add(doc.id);
				setTimeout(async () => {
					const vipMember = await officialServer.members.fetch(doc.id);
					vipMember.roles.remove(vipRole);
					vips.delete(doc.id);
					refV.doc(doc.id).delete();
				}, ms);
			}
		});
	}
}

module.exports = removeVIP;