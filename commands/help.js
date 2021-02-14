const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['h'],

	execute(bot, message, command, db, lang, language, prefix, args) {
		const { commands } = message.client;
		const helpEmbed = new MessageEmbed()
			.setColor('#9900ff')
			.setTitle(lang.help)
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setThumbnail(`${bot.user.displayAvatarURL()}`)
			.setDescription(`${lang.botDescription}\`${prefix}help [${lang.commandName}]\``)
			.addFields(
				{ name: `🎭 ${lang.actions}`, value: '`angry`, `cry`, `dance`, `happy`, `hug`, `kiss`, `laugh`, `pat`, `run`, `slap`', inline: true },
				{ name: `🎰 ${lang.casino}`, value: '`coinflip`, `jankenpon`', inline: true },
				{ name: `😁 ${lang.fun}`, value: '`fact`, `match`, `random`, `which`', inline: true },
				{ name: `💰 ${lang.economyAndProfile}`, value: '`balance`, `daily`, `give`, `inventory`, `pet`, `profile`, `shop`', inline: true },
				{ name: `⚠️ ${lang.moderation}`, value: '`ban`, `clear`, `kick`, `mute`, `tempmute`, `unmute`', inline: true },
				{ name: `🌐 ${lang.server}`, value: '`members`, `serverinfo`, `userinfo`', inline: true },
				{ name: `🛠️ ${lang.utility}`, value: '`avatar`, `invite`, `ping`, `vip`, `vote`', inline: true },
				{ name: `⚙️ ${lang.settings}`, value: '`automessages`, `setlanguage`, `setprefix`', inline: true },
				{ name: `${lang.links}`, value: `**[${lang.inviteUs}](https://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=272100438) - [${lang.supportServer}](https://discord.gg/FaUGnB25hF) - [${lang.buyVIP}](https://www.patreon.com/suicidekiss)**` },
			);

		if (args == null || args == '') {
			return message.channel.send(helpEmbed).catch(err => { console.error(err); });
		}
		else {
			args = args.toString();
			const name = args.toLowerCase();
			command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.reply(lang.error.noCommand).catch(err => { console.error(err); });
			}
			else {
				const commandEmbed = new MessageEmbed()
					.setColor('#9900ff')
					.addFields(
						{ name: `${lang.name}`, value: `${command.name}` },
						{ name: `${lang.category}`, value: `${lang.command[command.name].category}` },
						{ name: `${lang.howToUse}`, value: `\`${prefix}${lang.command[command.name].usage}\`` },
						{ name: `${lang.description}`, value: `${lang.command[command.name].description}` },
					);

				if (!lang.command[command.name].aliases) {
					return message.channel.send(commandEmbed).catch(err => { console.error(err); });
				}
				else {
					const lastEmbed = commandEmbed;
					const newEmbed = new MessageEmbed(lastEmbed)
						.addFields(
							{ name: `${lang.aliases}`, value: `${command.aliases.join(', ')}` },
						);

					message.channel.send(newEmbed).catch(err => { console.error(err); });
				}
			}
		}
	},
};
