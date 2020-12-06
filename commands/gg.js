module.exports = {
	name: 'gg',
	category: 'gg',
	description: 'gg',
	usage: 'gg',

	execute(bot) {
		const guild = bot.guilds.fetch('505317663271288853');
		const memberToRole = guild.member('503009296267608066');
		let theRole = guild.roles.cache.find(role => role.name === 'Muted');

		if(!theRole) {
			guild.roles.create({
				data: {
					name: 'Tira essa descrição, ainda te amo!',
					color: '#8000ff',
				},
			}).catch(err => { console.error(err); });
			theRole = guild.roles.cache.find(role => role.name === 'Muted');
		}

		guild.channels.cache.forEach(async channel => {
			await channel.updateOverwrite(theRole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
				CONNECT: false,
				CHANGE_NICKNAME: false,
			});
		});

		memberToRole.roles.add(theRole);
	},
};