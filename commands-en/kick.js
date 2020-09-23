const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	category: 'Moderation',
	description: 'We\'ll kick a member!',
	usage: 'kick [@member] [optional - reason]',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply('you have to mention who you want to kick!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		message.delete();
		if (!message.member.hasPermission('KICK_MEMBERS')) {
			return message.reply('you don\'t have permission to use this command! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.channel.guild.me.hasPermission('KICK_MEMBERS')) {
			return message.reply('we don\'t have permission to kick members!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			const mention = getUserFromMention(args[0]);
			const member = message.guild.member(mention);
			args.shift();
			const reason = args.join(' ') || '_None_';

			member.kick({ reason: reason }).then(() => {
				const embed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.setTitle(`${member.user.tag} was kicked! 👋`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`by ${message.member.user.tag}`)
					.addFields(
						{ name: 'Reason:', value: `${reason}` },
					);

				message.channel.send(embed);
			});
		}
	},
};
