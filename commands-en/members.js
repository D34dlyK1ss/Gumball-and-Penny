module.exports = {
	name: 'members',
	category: 'Server',
	description: 'We\'ll show you this server\'s member count!',
	usage: 'members',

	execute(bot, message) {
		message.channel.send(`**${message.guild.name}** has **${message.guild.memberCount}** members!`);
	},
};