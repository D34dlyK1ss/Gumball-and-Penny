const Discord = require('discord.js');

module.exports = {
	name: 'ban',
	category: 'Moderação',
	description: 'Baniremos um membro do servidor!',
	usage: 'ban [@membro] [opcional - razão]',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply('tens de mencionar quem queres expulsar!').then(msg => msg.delete({ timeout: 5000 })).catch();
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		message.delete();
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else if (!message.channel.guild.me.hasPermission('BAN_MEMBERS')) {
			return message.reply('nós não temos permissão para banir membros!').then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else {
			const mention = getUserFromMention(args[0]);
			const member = message.guild.member(mention);
			args.shift();
			const reason = args.join(' ') || '_Não indicada_';

			member.ban({ reason: reason }).then(() => {
				const embed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.setTitle(`${member.user.tag} foi banido! 🔨`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`por ${message.member.user.tag}`)
					.addFields(
						{ name: 'Razão:', value: `${reason}` },
					);

				message.channel.send(embed).catch();
			});
		}
	},
};