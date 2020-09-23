const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'tempmute',
	category: 'Moderação',
	description: 'We\'ll mute a member temporarily!',
	usage: 'tempmute [@member] [seconds] [optional - reason]',

	execute(bot, message, command, args) {
		function getUserFromMention(mention) {
			if (!mention) {
				return message.reply('you have to mention who you want to mute!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
			}

			const matches = mention.match(/^<@!?(\d+)>$/);

			if (!matches) return;

			const id = matches[1];

			return bot.users.cache.get(id);
		}

		function timeConversion(value) {
			value = Number(value);
			const h = Math.floor(value / 3600);
			const m = Math.floor(value % 3600 / 60);
			const s = Math.floor(value % 3600 % 60);

			const hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
			const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';
			const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
			return hDisplay + mDisplay + sDisplay;
		}

		message.delete();
		const muteCooldown = new Set();

		if (!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission('MANAGE_CHANNELS')) {
			return message.reply('you don\'t have permission to use this command! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.channel.guild.me.hasPermission('MANAGE_ROLES')) {
			return message.reply ('we don\'t have permission to manage roles!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (!message.channel.guild.me.hasPermission('MANAGE_CHANNELS')) {
			return message.reply ('we don\'t have permission to manage channels!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			const mention = getUserFromMention(args[0]);
			const memberToMute = message.guild.member(mention);
			args.shift();
			let seconds = parseInt(args[0]);
			args.shift();
			const reason = args.join(' ') || '_None_';
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
					.setTitle(`${memberToMute.user.tag} is now muted for ${timeConversion(seconds)}! 🔇`)
					.setThumbnail(`${memberToMute.user.displayAvatarURL()}`)
					.setDescription(`by ${message.member.user.tag}`)
					.setFooter(`until ${moment().add(seconds, 'seconds').calendar()}`)
					.addFields(
						{ name: 'Reason', value: `${reason}` },
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