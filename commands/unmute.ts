import { GuildChannel, Message, Role } from 'discord.js';

export const name = 'unmute';
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.permissions.has('MANAGE_ROLES') || !message.member.permissions.has('MANAGE_CHANNELS')) {
		message.reply(lang.error.noPerm).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
	}
	else if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
		message.reply(lang.error.botNoManageRoles).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
	}
	else {
		const mention = message.mentions.users.first();
		const memberToUnmute = await message.guild.members.fetch(mention);

		args.shift();
		
		let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

		if (!mention) {
			message.reply(lang.error.noMention).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
		}
		else {
			if (!muteRole) {
				message.guild.roles.create({
					name: 'Muted',
					color: '#404040',
				});

				muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
				message.guild.channels.cache.forEach(async (channel: GuildChannel) => {
					await channel.permissionOverwrites.edit(muteRole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						CONNECT: false,
						CHANGE_NICKNAME: false,
					});
				});
			}

			if (!memberToUnmute.roles.cache.find((role: Role) => role.name === 'Muted')) {
				message.reply(lang.error.memberNotMuted).catch(err => { console.error(err); });
			}
			else {
				memberToUnmute.roles.remove(muteRole);
				message.channel.send(`${memberToUnmute}${lang.unmute.isNowUnmuted}`).catch(err => { console.error(err); });
			}
		}
	}
};