import { Message, MessageActionRow, MessageButton } from 'discord.js';

export const name = 'vip';
export function execute(bot: undefined, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel('Link')
			.setStyle('LINK')
			.setURL('https://top.gg/bot/679041548955942914/vote')
	);

	message.channel.send({ content: lang.vip.click, components: [row] });
}
