import { Message, MessageEmbed } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import ms from 'ms';

export const name = 'timeout';
export async function execute(bot: BotClient, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: undefined, args: string[]) {
	if (!message.member.permissions.has('MODERATE_MEMBERS')) {
		message.reply(lang.error.noPerm);
	}
	else if (!message.guild.me.permissions.has('MODERATE_MEMBERS')) {
		message.reply(lang.error.noModerateMembers);
	}
	else {
		const mention = message.mentions.users.first();

		if (!mention) {
			message.reply(lang.error.noMention);
		}
		else if (mention === bot.user) {
			message.reply(lang.timeout.whyTimeUsOut);
		}
		else if (mention === message.author) {
			message.reply(lang.timeout.timeSelfOut);
		}
		else {
			const memberToTimeOut = await message.guild.members.fetch(mention);

			if (memberToTimeOut.roles.highest.position > message.guild.me.roles.highest.position) {
				message.reply(getText(lang.timeout.youCannotTimeOut, [mention.tag]));
			}
			else if (!args[1]) {
				if (!memberToTimeOut.isCommunicationDisabled()) {
					message.reply(getText(lang.timeout.isNotTimedOut, [mention.tag]));
				}
				else {
					memberToTimeOut.timeout(null).then(() => {
						message.channel.send(getText(lang.timeout.timeOutRemoved, [mention.tag]));
					});
				}
			}
			else {
				if (!/[0-9][smhd]$/.test(args[1])) {
					message.reply(lang.timeout.wrongTimeFormat);
				}
				else {
					let duration = Math.abs(ms(args[1]));

					if (duration > ms('7d')) duration = ms('7d');

					args.shift();
					args.shift();

					const reason: string = args.join(' ') || lang.notIndicated;

					memberToTimeOut.timeout(duration, reason).then(() => {
						const embed = new MessageEmbed()
							.setColor('DARK_PURPLE')
							.setTitle(getText(lang.timeout.isTimedOutFor, [memberToTimeOut.user.tag, ms(duration)]))
							.setThumbnail(`${memberToTimeOut.user.displayAvatarURL()}`)
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
}