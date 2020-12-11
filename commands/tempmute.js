const Discord = require('discord.js');

module.exports = {
	name: 'tempmute',

	execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply(lang.error.noMention).then(msg => msg.delete({ timeout: 5000 })).catch();
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		message.delete();
		const muteCooldown = new Set();

		if (!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.reply(lang.error.noPerm).then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else if (!message.channel.guild.me.hasPermission('MANAGE_ROLES')) {
			return message.reply (lang.error.botNoManageRoles).then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else if (!message.channel.guild.me.hasPermission('MANAGE_CHANNELS')) {
			return message.reply (lang.error.botNoManageChannels).then(msg => msg.delete({ timeout: 5000 })).catch();
		}
		else {
			const mention = getUserFromMention(args[0]);
			const memberToMute = message.guild.member(mention);
			args.shift();
			let seconds = parseInt(args[0]);
			args.shift();
			const reason = args.join(' ') || lang.notIndicated;
			let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

			if(seconds > 86400) seconds = 86400;

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
					.setTitle(`${memberToMute.user.tag}${lang.tempmute.isMutedFor + seconds + lang.tempmute.seconds} 🔇`)
					.setThumbnail(`${memberToMute.user.displayAvatarURL()}`)
					.setDescription(`${lang.by}${message.member.user.tag}`)
					.addFields(
						{ name: `${lang.reason}`, value: `${reason}` },
					);

				message.channel.send(embed).then(() => {
					muteCooldown.add(memberToMute.id);
					setTimeout(() => {
						muteCooldown.delete(memberToMute.id);
						memberToMute.roles.remove(muteRole);
					}, seconds * 1000);
				});
			});
		}
	},
};