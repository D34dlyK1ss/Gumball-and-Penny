const Discord = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: 'Help',
	description: 'You should already know! :unamused:',
	usage: 'help',

	execute(bot, message, command, args, db, prefix) {
		const { commands } = message.client,
			update = '';
		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#8000ff')
			.setTitle('Help')
			.setAuthor(`${bot.user.tag}`, `${bot.user.displayAvatarURL()}`)
			.setThumbnail(`${bot.user.displayAvatarURL()}`)
			.setDescription(`We're Gumball and Penny and we want to turn every server in a fun place to be!
			In case of any question use \`${prefix}help [command]\`
			${update}`)
			.addFields(
				{ name: '🎭 Actions', value: '`angry`, `cry`, `dance`, `hug`, `kiss`, `laugh`, `pat`, `run`, `slap`', inline: true },
				{ name: '🎰 Casino', value: '`coinflip`', inline: true },
				{ name: '💸 Donations', value: '`donate`', inline: true },
				{ name: '💰 Economy and Profile', value: '`balance`, `daily`, `give`, `shop`, `profile`, `vote`', inline: true },
				{ name: '😁 Fun', value: '`fact`, `match`, `random`, `say`, `which`', inline: true },
				{ name: '⚠️ Moderation', value: '`ban`, `clear`, `kick`, `mute`, `tempmute`, `unmute`', inline: true },
				{ name: '🌐 Server', value: '`members`, `serverinfo`, `setprefix`, `userinfo`', inline: true },
				{ name: '🛠️ Utility', value: '`avatar`, `invite`, `ping`, `support`', inline: true },
			);

		if (args == null || args == '') {
			return message.channel.send(helpEmbed);
		}
		else {
			args = args.toString();
			const name = args.toLowerCase();
			command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {
				return message.reply('that command doesn\'t exist!');
			}
			else {
				const commandEmbed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.addFields(
						{ name: 'Name', value: `${command.name}` },
						{ name: 'Category', value: `${command.category}` },
						{ name: 'Usage', value: `\`${prefix}${command.usage}\`` },
						{ name: 'Description', value: `${command.description}` },
					);

				if (!command.aliases) {
					return message.channel.send(commandEmbed);
				}
				else {
					const lastEmbed = commandEmbed;
					const newEmbed = new Discord.MessageEmbed(lastEmbed)
						.addFields(
							{ name: 'Aliases', value: `${command.aliases.join(', ')}` },
						);

					message.channel.send(newEmbed);
				}
			}
		}
	},
};
