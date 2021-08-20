import { Message } from 'discord.js';
import { Cmd } from 'index';

export const name = 'happy';
export function execute(bot: undefined, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>) {
	const rnd = Math.floor(Math.random() * 6);

	message.channel.send({ content: `${message.author}${lang.happy.isHappy}`, files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
}