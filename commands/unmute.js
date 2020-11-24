module.exports = {
	name: 'unmute',
	category: 'Moderação',
	description: 'Põe qualquer membro a falar outra vez!',
	usage: 'unmute [@membro]',

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

		message.delete();
		if (!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.channel.guild.me.hasPermission('MANAGE_ROLES')) {
			return message.reply ('não temos permissão para gerir roles!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			const mention = getUserFromMention(args[0]);
			const memberToUnmute = message.guild.member(mention);
			args.shift();
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

			if (!memberToUnmute.roles.cache.find(role => role.name === 'Muted')) {
				return message.reply('esse membro não está muted!').catch();
			}
			else {
				memberToUnmute.roles.remove(muteRole);
				message.channel.send(`${memberToUnmute} foi unmuted!`).catch();
			}
		}
	},
};