import { Message, MessageEmbed } from 'discord.js';
import { Cmd } from 'index';

export const name = 'ban';
export async function execute(bot: undefined, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.permissions.has('BAN_MEMBERS')) {
		message.reply(lang.error.noPerm).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
	}
	else if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
		message.reply(lang.error.botNoBan).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
	}
	else {
		const mention = message.mentions.users.first();
		const member = await message.guild.members.fetch(mention);

		args.shift();

		const reason = args.join(' ') || lang.notIndicated;

		if (!mention) {
			message.reply(lang.error.noMention).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).catch(err => { console.error(err); });
		}
		else {
			member.ban(reason).then(() => {
				const embed = new MessageEmbed()
					.setColor('#9900ff')
					.setTitle(`${member.user.tag}${lang.ban.wasBanned} 🔨`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`${lang.by}${message.member.user.tag}`)
					.addFields(
						{ name: `${lang.reason}`, value: `${reason}` }
					);

				message.channel.send({ embeds: [embed] }).catch(err => { console.error(err); });
			});
		}
	}
}