const Discord = require('discord.js');

module.exports = {
	name: 'mute',
	category: 'Moderação',
	description: 'Calaremos um membro do servidor!',
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

		if (!message.channel.guild.me.hasPermission('MANAGE_ROLES') || !message.channel.guild.me.hasPermission('MANAGE_CHANNELS')) {
			return message.reply ('não temos permissão para manusear roles/canais!');
		}
		else if (!message.member.hasPermission('MUTE_MEMBERS')) {
			return message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			const mention = getUserFromMention(args[0]);
			const memberToMute = message.guild.member(mention);
			args.shift();
			const reason = args.join(' ') || '_Não indicada_';
			let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

			if(!muteRole) {
				message.guild.roles.create({
					data: {
						name: 'Muted',
						color: '#404040',
					},
				}).catch(err => { console.error(err); });
				muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
			}

			message.guild.channels.cache.forEach(async channel => {
				await channel.updateOverwrite(muteRole, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false,
					CONNECT: false,
					CHANGE_NICKNAME: false,
				});
			});

			memberToMute.roles.add(muteRole).then(() => {
				const embed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.setTitle(`${memberToMute.user.tag} foi mutado! 🔇`)
					.setThumbnail(`${memberToMute.user.displayAvatarURL()}`)
					.setDescription(`por ${message.member.user.tag}`)
					.addFields(
						{ name: 'Razão', value: `${reason}` },
					);

				message.channel.send(embed);
			});
		}
	},
};