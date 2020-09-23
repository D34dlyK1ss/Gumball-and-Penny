module.exports = {
	name: 'support',
	category: 'Utility',
	description: 'The invite to to our support server!',
	usage: 'support',

	execute(bot, message) {
		message.channel.send('Do you have any questions or want to suggest an idea? So here you have the invite link to our support server 👇\nhttps://discord.com/invite/r249y37');
	},
};