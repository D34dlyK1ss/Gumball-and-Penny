import { Message } from 'discord.js';
import getText from '../src/functions/getText';

export const name = 'members';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
	message.channel.send(getText(lang.members.message, [message.guild.name, message.guild.memberCount]));
}