module.exports = {
	name: 'members',

	execute(bot, message, command, db, lang) {
		message.channel.send(`**${message.guild.name}**${lang.has}**${message.guild.memberCount}**${lang.members}!`).catch();
	},
};