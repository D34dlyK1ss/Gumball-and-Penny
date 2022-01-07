import botConfig from '../../botConfig.json';

async function giveVoteRewards(db: FirebaseFirestore.Firestore, vips: Set<string>, userID: string) {
	const refP = db.collection('perfis').doc(userID);

	await refP.get().then(docP => {
		if (!docP.exists) return;
		const bal: number = docP.get('balance');
		const xp: number = docP.get('xp');
		let addMoney = 150;
		let addXP = 60;

		if (userID === botConfig.botOwnerID || botConfig.collaboratorIDs.includes(userID) || vips.has(userID)) {
			addMoney *= 2;
			addXP *= 2;
		}

		refP.update({
			balance: bal + addMoney,
			xp: xp + addXP
		});
	});
}

export default giveVoteRewards;