import { Message, MessageEmbed } from 'discord.js';
import { Cmd } from 'index';
import text from '../src/functions/text';

export const name = 'ban';
export async function execute(bot: undefined, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.permissions.has('BAN_MEMBERS')) {
		message.reply(lang.error.noPerm);
	}
	else if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
		message.reply(lang.error.botNoBan);
	}
	else {
		const mention = message.mentions.users.first();
		const member = await message.guild.members.fetch(mention);

		args.shift();

		const reason = args.join(' ') || lang.notIndicated;

		if (!mention) {
			message.reply(lang.error.noMention);
		}
		else {
			member.ban(reason).then(() => {
				const embed = new MessageEmbed()
					.setColor('DARK_PURPLE')
					.setTitle(text(member.user.tag, [lang.ban.wasBanned]))
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`${lang.by}${message.member.user.tag}`)
					.addFields(
						{ name: `${lang.reason}`, value: `${reason}` }
					);

				message.channel.send({ embeds: [embed] });
			});
		}
	}
}