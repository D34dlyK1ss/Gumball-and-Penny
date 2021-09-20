import { Message, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';

export const name = 'setlanguage';
export function execute(bot: undefined, message: Message, command: undefined, db: any, lang: Record<string, string | any>) {
	if (!message.member.permissions.has('MANAGE_GUILD')) {
		message.reply(lang.error.noPerm).catch(err => { console.error(err); });
	}
	else {
		const menuRow = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`languageMenu${message.member.id}`)
					.setPlaceholder(lang.interaction.nothingSelected)
					.addOptions([
						{
							label: 'English',
							value: 'en'
						},
						{
							label: 'Português',
							value: 'pt'
						}
					])
			);
		const buttonRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(`languageOK${message.member.id}`)
					.setLabel(lang.ok)
					.setStyle('SUCCESS'),
				
				new MessageButton()
					.setCustomId(`languageCancel${message.member.id}`)
					.setLabel(lang.cancel)
					.setStyle('DANGER')
			);

		message.reply({ content: lang.setlanguage.select, components: [menuRow, buttonRow] });
	}
}
