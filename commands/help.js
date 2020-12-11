const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['h'],

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		const { commands } = message.client;
		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setTitle(lang.help)
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setThumbnail(`${bot.user.displayAvatarURL()}`)
			.setDescription(`${lang.botDescription}\`${prefix}help [${lang.commandName}]\``)
			.addFields(
				{ name: `🎭 ${lang.actions}`, value: '`angry`, `cry`, `dance`, `hug`, `kiss`, `laugh`, `pat`, `run`, `slap`', inline: true },
				{ name: `🎰 ${lang.casino}`, value: '`coinflip`', inline: true },
				{ name: `😁 ${lang.fun}`, value: '`fact`, `match`, `random`, `say`, `which`', inline: true },
				{ name: `💰 ${lang.economyAndProfile}`, value: '`balance`, `daily`, `give`, `inventory`, `pet`, `profile`, `shop`, `vote`', inline: true },
				{ name: `⚠️ ${lang.moderation}`, value: '`ban`, `clear`, `kick`, `mute`, `tempmute`, `unmute`', inline: true },
				{ name: `🌐 ${lang.server}`, value: '`members`, `serverinfo`, `setprefix`, `userinfo`', inline: true },
				{ name: `🛠️ ${lang.moderation}`, value: '`avatar`, `invite`, `ping`', inline: true },
				{ name: '**Links**', value: `**[${lang.inviteUs}](https://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=272100438) - [${lang.supportServer}](https://discord.gg/FaUGnB25hF) - [${lang.donate}](https://ko-fi.com/officialgumballandpenny/commissions)**` },
			);

		if (args == null || args == '') {
			return message.channel.send(helpEmbed).catch();
		}
		else {
			args = args.toString();
			const name = args.toLowerCase();
			command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.reply(lang.error.noCommand).catch();
			}
			else {
				const commandEmbed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.addFields(
						{ name: `${lang.name}`, value: `${command.name}` },
						{ name: `${lang.category}`, value: `${lang.command[command.name].category}` },
						{ name: `${lang.howToUse}`, value: `\`${prefix}${lang.command[command.name].usage}\`` },
						{ name: `${lang.description}`, value: `${lang.command[command.name].description}` },
					);

				if (!lang.command[command.name].aliases) {
					return message.channel.send(commandEmbed).catch();
				}
				else {
					const lastEmbed = commandEmbed;
					const newEmbed = new Discord.MessageEmbed(lastEmbed)
						.addFields(
							{ name: `${lang.aliases}`, value: `${command.aliases.join(', ')}` },
						);

					message.channel.send(newEmbed).catch();
				}
			}
		}
	},
};
