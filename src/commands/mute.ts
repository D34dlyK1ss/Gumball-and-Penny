import { Message, MessageEmbed, GuildChannel } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import ms from 'ms';

export const name = 'mute';
export async function execute(bot: BotClient, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	if (!message.member.permissions.has('MANAGE_ROLES') || !message.member.permissions.has('MANAGE_CHANNELS')) {
		message.reply(lang.error.noPerm);
	}
	else if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
		message.reply(lang.error.botNoManageRoles);
	}
	else if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
		message.reply(lang.error.botNoManageChannels);
	}
	else {
		const mention = message.mentions.users.first();
		const memberToMute = await message.guild.members.fetch(mention);
		const author = await message.guild.members.fetch(message.author.id);

		if (!mention) {
			message.reply(lang.error.noMention);
		}
		else if (mention === bot.user) {
			message.reply(lang.mute.whyMuteUs);
		}
		else if (mention === message.author) {
			message.reply(lang.mute.muteSelf);
		}
		else if (!(author.roles.highest.comparePositionTo(memberToMute.roles.highest) > 0)) {
			message.reply(getText(lang.mute.youCannotMute, [mention.tag]));
		}
		else if (!args[1]) {
			message.reply(lang.error.noDuration);
		}
		else {
			
			let duration = Math.abs(ms(args[1]));

			if (duration > ms('7d')) duration = ms('7d');

			args.shift();
			args.shift();

			const reason = args.join(' ') || lang.notIndicated;
			let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

			if (!muteRole) {
				message.guild.roles.create({
					name: 'Muted',
					color: '#2f3136'
				});

				muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

				message.guild.channels.cache.forEach(async (channel: GuildChannel) => {
					await channel.permissionOverwrites.edit(muteRole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						SPEAK: false
					});
				});
			}

			if (memberToMute) {
				memberToMute.roles.add(muteRole).catch(() => {
					message.reply(getText(lang.mute.cannotMute, [muteRole.name]));
				}).then(() => {
					const embed = new MessageEmbed()
						.setColor('DARK_PURPLE')
						.setTitle(getText(lang.mute.isMutedFor, [memberToMute.user.tag, ms(duration)]))
						.setThumbnail(`${memberToMute.user.displayAvatarURL()}`)
						.setDescription(`${lang.by} ${message.member.user.tag}`)
						.addFields(
							{ name: `${lang.reason}`, value: `${reason}` }
						);
	
					message.channel.send({ embeds: [embed] }).then(() => {
						setTimeout(() => {
							memberToMute.roles.remove(muteRole);
						}, duration);
					});
				});
			}
		}
	}
}