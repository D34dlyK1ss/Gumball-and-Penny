import { Message, MessageEmbed } from 'discord.js';

export const name = 'kick';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	message.delete();
	if (!message.member.hasPermission('KICK_MEMBERS')) {
		message.reply(lang.error.noPerm).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
	}
	else if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
		message.reply(lang.error.botNoKick).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
	}
	else {
		const mention = message.mentions.users.first();
		const member = message.guild.member(mention);
		
		args.shift();
		
		const reason = args.join(' ') || lang.notIndicated;

		if (!mention) {
			message.reply(lang.error.noMention).then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			member.kick(reason).then(() => {
				const embed = new MessageEmbed()
					.setColor('#9900ff')
					.setTitle(`${member.user.tag}${lang.kick.wasKicked} 👋`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`${lang.by}${message.member.user.tag}`)
					.addFields(
						{ name: `${lang.reason}`, value: `${reason}` },
					);

				message.channel.send(embed).catch(err => { console.error(err); });
			});
		}
	}
};
