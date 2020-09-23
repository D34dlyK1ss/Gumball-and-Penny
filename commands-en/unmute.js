module.exports = {
	name: 'unmute',
	category: 'Moderation',
	description: 'Unmute a muted member!',
	usage: 'unmute [@member]',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply('you have to mention who you want to unmute!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		message.delete();
		if (!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.reply('you don\'t have permission to use this command! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.channel.guild.me.hasPermission('MANAGE_ROLES')) {
			return message.reply ('we don\'t have permission to manage roles!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
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
				return message.reply('that member isn\'t muted!');
			}
			else {
				memberToUnmute.roles.remove(muteRole);
				message.channel.send(`${memberToUnmute} is now unmuted!`);
			}
		}
	},
};