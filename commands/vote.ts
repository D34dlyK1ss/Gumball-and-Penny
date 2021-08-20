import { Message } from 'discord.js';

export const name = 'vote';
export function execute(bot: undefined, message: Message) {
	message.channel.send('https://top.gg/bot/679041548955942914/vote').catch(err => { console.error(err); });
}
