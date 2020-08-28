module.exports = {
	name: 'members',
	category: 'Servidor',
	description: 'Mostraremos a quantidade de membros no servidor!',
	usage: 'members',

	execute(bot, message) {
		message.channel.send(`**${message.guild.name}** tem **${message.guild.memberCount}** membros!`);
	},
};