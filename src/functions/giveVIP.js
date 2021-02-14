async function giveVIP(db, message, args) {
	const refV = db.collection('vip').doc(message.author.id),
		timestamp = new Date(Date.now() + (2592000000));

	if (args !== undefined) {
		args.forEach(id => {
			db.collection('vip').doc(id).set({
				until: timestamp,
			}).then(() => {
				const memberToVIP = message.guild.member(id),
					vipRole = message.guild.roles.cache.find(role => role.name === 'VIP');

				memberToVIP.roles.add(vipRole);
			});
		});
		await message.react('✅').catch(err => { console.error(err); });

		let plural;

		args.length === 1 ? plural = ' é' : plural = 'es são';

		return message.channel.send(`${args.length} utilizador${plural} agora VIP por 1 mês!`).catch(err => { console.error(err); });
	}
	else {
		refV.get().then(async doc => {
			if (doc.exists) {
				message.react('❌').catch(err => { console.error(err); });
			}
			else {
				return refV.set({
					until: timestamp,
				}).then(() => {
					const memberToVIP = message.guild.member(message.author.id),
						vipRole = message.guild.roles.cache.find(role => role.name === 'VIP');

					memberToVIP.roles.add(vipRole).then(() => {
						message.react('✅').catch(err => { console.error(err); });
					});
				});
			}
		});
	}
}

module.exports = giveVIP;