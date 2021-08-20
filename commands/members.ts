import { Message } from 'discord.js';

export const name = 'members';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
		message.channel.send(`**${message.guild.name}**${lang.has}**${message.guild.memberCount}**${lang.members}!`).catch(err => { console.error(err); });
}