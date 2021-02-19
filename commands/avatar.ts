import { Message, MessageAttachment } from 'discord.js';

export const name = 'avatar';
export const aliases = ['icon', 'pfp'];
export function execute(bot: undefined, message: Message) {
	const user = message.mentions.users.first() || message.author;
	message.channel.send(new MessageAttachment(user.displayAvatarURL())).catch(err => { console.error(err); });
};