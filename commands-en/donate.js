module.exports = {
	name: 'donate',
	category: 'Donations',
	description: 'Send a donation to our creator!',
	usage: 'donate',

	execute(bot, message) {
		message.channel.send('You can donate a coffee at the moment ☕\nhttps://ko-fi.com/d34dlyk1ss');
	},
};