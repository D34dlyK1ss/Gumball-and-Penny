import { Message, MessageEmbed } from 'discord.js';
import getText from '../functions/getText';

export const name = 'ban';
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.permissions.has('BAN_MEMBERS')) {
		message.reply(lang.error.noPerm);
	}
	else if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
		message.reply(lang.error.botNoBan);
	}
	else {
		const mention = message.mentions.users.first();

		if (!mention) {
			message.reply(lang.error.noMention);
		}
		else {
			args.shift();

			const reason = args.join(' ') || lang.notIndicated;
			const member = await message.guild.members.fetch(mention).catch(() => undefined);

			if (member) {
				member.ban(reason).then(() => {
					const embed = new MessageEmbed()
						.setColor('DARK_PURPLE')
						.setTitle(getText(lang.ban.wasBanned, [member.user.tag]))
						.setThumbnail(`${member.user.displayAvatarURL()}`)
						.setDescription(`${lang.by} ${message.member.user.tag}`)
						.addFields(
							{ name: `${lang.reason}`, value: `${reason}` }
						);
	
					message.channel.send({ embeds: [embed] });
				});
			}
		}
	}
}