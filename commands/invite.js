module.exports = {
	name: 'invite',

	execute(bot, message, command, db, lang) {
		message.channel.send(`${lang.inviteUsToYourServer} 😁\nhttps://discordapp.com/oauth2/authorize?&client_id=${bot.user.id}&scope=bot&permissions=272100438`).catch(err => { console.error(err); });
	},
};