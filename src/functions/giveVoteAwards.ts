import botConfig from 'botConfig.json';

async function giveVoteAwards(db: FirebaseFirestore.Firestore, userID: string) {
	const refP = db.collection('perfis').doc(userID);

	await refP.get().then(doc => {
		if (!doc.exists) return;
		const bal: number = doc.get('balance');
		let add = 150;

		if (userID === botConfig.botOwnerID || botConfig.collaboratorIDs.includes(userID) || vips.has(userID)) {
			add *= 2;
		}

		refP.get().then(docP => {
			if (docP.exists) {
				refP.update({
					balance: bal + add
				});
			}
		});
	});
}

export default giveVoteAwards;