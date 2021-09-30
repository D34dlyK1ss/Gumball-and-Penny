import { Message } from 'discord.js';

export const name = 'vip';
export function execute(bot: undefined, message: Message) {
	message.channel.send('https://www.patreon.com/suicidekiss');
}
