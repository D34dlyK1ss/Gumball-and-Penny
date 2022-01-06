import { Message, MessageEmbed } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../functions/getText';

export const name = 'help';
export const aliases = ['h'];
export function execute(bot: BotClient, message: Message, command: Cmd, db: undefined, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const commands = bot.commands;
	const helpEmbed = new MessageEmbed()
		.setColor('DARK_PURPLE')
		.setTitle(lang.help)
		.setThumbnail(`${bot.user.displayAvatarURL()}`)
		.setDescription(getText(lang.helpDescription, [prefix, lang.commandName]))
		.addFields(
			{ name: `🎭 ${lang.actions}`, value: '`angry`, `blush`, `cry`, `dance`, `happy`, `hug`, `kiss`, `laugh`, `pat`, `run`, `scared`, `slap`, `sleep`, `wink`', inline: true },
			{ name: `🎰 ${lang.casino}`, value: '`coinflip`, `jankenpon`', inline: true },
			{ name: `😁 ${lang.fun}`, value: '`fact`, `match`, `quiz`, `random`, `which`', inline: true },
			{ name: `💰 ${lang.economyAndProfile}`, value: '`balance`, `daily`, `give`, `inventory`, `pet`, `profile`, `ranking`, `shop`', inline: true },
			{ name: `⚠️ ${lang.moderation}`, value: '`ban`, `clear`, `kick`, `timeout`', inline: true },
			{ name: `🌐 ${lang.server}`, value: '`members`, `serverinfo`, `userinfo`', inline: true },
			{ name: `🛠️ ${lang.utility}`, value: '`avatar`, `invite`, `ping`, `vote`', inline: true },
			{ name: `⚙️ ${lang.settings}`, value: '`automessages`, `setlanguage`, `setprefix`', inline: true },
			{ name: `${lang.links}`, value: `**[${lang.inviteUs}](https://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=272100438) - [${lang.buyVIP}](https://www.patreon.com/suicidekiss)**` }
		);

	if (!args[0]) {
		message.channel.send({ embeds: [helpEmbed] });
	}
	else {
		const argsString = args.toString();
		const commandName = argsString.toLowerCase();
		command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));
		if (!command) {
			message.reply(lang.error.noCommand);
		}
		else {
			const commandEmbed = new MessageEmbed()
				.setColor('DARK_PURPLE')
				.addFields(
					{ name: `${lang.name}`, value: `${command.name}` },
					{ name: `${lang.category}`, value: `${lang.command[command.name].category}` },
					{ name: `${lang.howToUse}`, value: `\`${prefix}${lang.command[command.name].usage}\`` },
					{ name: `${lang.description}`, value: `${lang.command[command.name].description}` }
				);

			if (!command.aliases) {
				message.channel.send({ embeds: [commandEmbed] });
			}
			else {
				const lastEmbed = commandEmbed;
				const newEmbed = new MessageEmbed(lastEmbed)
					.addFields(
						{ name: `${lang.aliases}`, value: `${command.aliases.join(', ')}` }
					);

				message.channel.send({ embeds: [newEmbed] });
			}
		}
	}
}
