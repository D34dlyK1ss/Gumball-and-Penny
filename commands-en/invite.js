module.exports = {
	name: 'invite',
	category: 'Utility',
	description: 'We\'ll send our invite link!',
	usage: 'invite',

	execute(bot, message) {
		message.channel.send('Invite us to your server! :grin:\nhttps://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=272100438');
	},
};