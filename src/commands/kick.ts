import { Message, MessageEmbed } from 'discord.js';
import getText from '../functions/getText';

export const name = 'kick';
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.permissions.has('KICK_MEMBERS')) {
		message.reply(lang.error.noPerm);
	}
	else if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
		message.reply(lang.error.botNoKick);
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
			member.kick(reason).then(() => {
				const embed = new MessageEmbed()
					.setColor('DARK_PURPLE')
					.setTitle(getText(lang.kick.wasKicked, [member.user.tag]))
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
