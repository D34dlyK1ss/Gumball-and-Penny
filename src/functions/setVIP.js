function setVIP(db, args, officialServer, timestamp, vipRole) {
	if(!vipRole) {
		officialServer.roles.create({
			data: {
				name: 'VIP',
				color: '#ffff00',
			},
		}).catch(err => { console.error(err); });
		vipRole = officialServer.roles.cache.find(role => role.name === 'VIP');
	}

	args.forEach(async id => {
		const memberToVIP = await officialServer.members.fetch(id);
		memberToVIP.roles.add(vipRole);
		db.collection('vip').doc(id).set({
			timestamp: timestamp,
		});
	});
}

module.exports = setVIP;