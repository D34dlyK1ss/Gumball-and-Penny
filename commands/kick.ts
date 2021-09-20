import { Message, MessageEmbed } from 'discord.js';

export const name = 'kick';
export async function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.permissions.has('KICK_MEMBERS')) {
		message.reply(lang.error.noPerm).catch(err => { console.error(err); });
	}
	else if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
		message.reply(lang.error.botNoKick).catch(err => { console.error(err); });
	}
	else {
		const mention = message.mentions.users.first();
		const member = await message.guild.members.fetch(mention);

		args.shift();

		const reason = args.join(' ') || lang.notIndicated;

		if (!mention) {
			message.reply(lang.error.noMention).catch(err => { console.error(err); });
		}
		else {
			member.kick(reason).then(() => {
				const embed = new MessageEmbed()
					.setColor('DARK_PURPLE')
					.setTitle(`${member.user.tag}${lang.kick.wasKicked} 👋`)
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
