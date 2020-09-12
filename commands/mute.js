const Discord = require('discord.js');

module.exports = {
	name: 'mute',
	category: 'Moderação',
	description: 'Baniremos um membro do servidor!',
	usage: 'mute [@membro] [opcional - razão]',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply('tens de mencionar quem queres expulsar!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		if (!message.member.hasPermission('MUTE_MEMBERS')) {
			return message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			message.delete();

			const mention = getUserFromMention(args[0]);
			const member = message.guild.member(mention),
				muteRole = message.guild.roles.find(muterole => muterole.name === 'Muted');
			let reason = args.join(' ');

			if(!muteRole) {
				message.guild.roles.create({
					data: {
						name: 'Muted',
						color: '#404040',
					},
					permissions: [],
				}).then(async role => {
					message.guild.channels.forEach(async (channel) => {
						await channel.overwritePermissions(role, {
							SEND_MESSAGES: false,
							ADD_REACTIONS: false,
							CONNECT: false,
							CHANGE_NICKNAME: false,
						});
					});
				}).catch(err => { console.error(err); });
			}

			member.roles.add(muteRole).then(() => {
				if (reason == '') reason = '_Não indicada_';
				const embed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.setTitle(`${member.user.tag} foi mutado! 🔇`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`por ${message.member.user.tag}`)
					.addFields(
						{ name: 'Razão', value: `${reason}` },
					);

				message.channel.send(embed);
			});
		}
	},
};