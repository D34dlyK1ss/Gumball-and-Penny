import { Message, MessageEmbed, GuildChannel } from 'discord.js';

export const name = 'mute';
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();

	if (!message.member.permissions.has('MANAGE_ROLES') || !message.member.permissions.has('MANAGE_CHANNELS')) {
		message.reply(lang.error.noPerm).catch(err => { console.error(err); });
	}
	else if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
		message.reply(lang.error.botNoManageRoles).catch(err => { console.error(err); });
	}
	else if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
		message.reply(lang.error.botNoManageChannels).catch(err => { console.error(err); });
	}
	else {
		const mention = message.mentions.users.first();
		const memberToMute = await message.guild.members.fetch(mention);
		let seconds = parseInt(args[1]);

		args.shift();
		args.shift();

		const reason = args.join(' ') || lang.notIndicated;
		let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

		if (!mention) {
			message.reply(lang.error.noMention).catch(err => { console.error(err); });
		}
		else if (!seconds) {
			message.reply(lang.error.noDuration).catch(err => { console.error(err); });
		}
		else {
			if (!muteRole) {
				message.guild.roles.create({
					name: 'Muted',
					color: '#404040'
				});

				muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

				message.guild.channels.cache.forEach(async (channel: GuildChannel) => {
					await channel.permissionOverwrites.edit(muteRole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						CONNECT: false,
						CHANGE_NICKNAME: false
					});
				});
			}

			if (seconds > 86400) seconds = 86400;

			memberToMute.roles.add(muteRole).then(() => {
				const embed = new MessageEmbed()
					.setColor('DARK_PURPLE')
					.setTitle(`${memberToMute.user.tag}${lang.mute.isMutedFor}${seconds}${lang.mute.seconds} 🔇`)
					.setThumbnail(`${memberToMute.user.displayAvatarURL()}`)
					.setDescription(`${lang.by}${message.member.user.tag}`)
					.addFields(
						{ name: `${lang.reason}`, value: `${reason}` }
					);

				message.channel.send({ embeds: [embed] }).then(() => {
					setTimeout(() => {
						memberToMute.roles.remove(muteRole);
					}, seconds * 1000);
				});
			});
		}
	}
}