const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ban',

	execute(bot, message, command, db, lang, language, prefix, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply(lang.error.noMention).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		message.delete();
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply(lang.error.noPerm).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.channel.guild.me.hasPermission('BAN_MEMBERS')) {
			return message.reply(lang.error.botNoBan).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			const mention = getUserFromMention(args[0]);
			const member = message.guild.member(mention);
			args.shift();
			const reason = args.join(' ') || lang.notIndicated;

			member.ban({ reason: reason }).then(() => {
				const embed = new MessageEmbed()
					.setColor('#8000ff')
					.setTitle(`${member.user.tag}${lang.ban.wasBanned} 🔨`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`${lang.by}${message.member.user.tag}`)
					.addFields(
						{ name: `${lang.reason}`, value: `${reason}` },
					);

				message.channel.send(embed).catch(err => { console.error(err); });
			});
		}
	},
};