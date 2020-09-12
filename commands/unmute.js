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

		if (!message.channel.guild.me.hasPermission('MANAGE_ROLES')) {
			return message.reply ('não temos permissão para manusear roles!');
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

			message.member.removeRole(muteRole);
			message.channel.send(`${memberToUnmute} foi unmuted!`);
		}
	},
};