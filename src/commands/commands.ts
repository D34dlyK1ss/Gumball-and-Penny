import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription(enLang.command.commands.description),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>) {
		const commandsEmbed = new EmbedBuilder()
			.setColor('DarkPurple')
			.setTitle(lang.commands)
			.setThumbnail(`${bot.user.displayAvatarURL()}`)
			.setDescription(lang.commands.commands.embedDescription)
			.addFields(
				{ name: `🎭 ${lang.actions}`, value: '`angry`, `blush`, `cry`, `dance`, `happy`, `hug`, `kiss`, `laugh`, `pat`, `run`, `scared`, `slap`, `sleep`, `wink`', inline: true },
				{ name: `🎰 ${lang.casino}`, value: '`coinflip`, `jankenpon`', inline: true },
				{ name: `😁 ${lang.fun}`, value: '`fact`, `match`, `quiz`, `random`, `which`', inline: true },
				{ name: `💰 ${lang.economyAndProfile}`, value: '`balance`, `daily`, `give`, `inventory`, `pet`, `profile`, `ranking`, `shop`, `vip`', inline: true },
				{ name: `🌐 ${lang.server}`, value: '`members`, `serverinfo`, `userinfo`', inline: true },
				{ name: `🛠️ ${lang.utility}`, value: '`avatar`, `clear`, `invite`, `ping`, `vote`', inline: true },
				{ name: `⚙️ ${lang.settings}`, value: '`setlanguage`', inline: true },
				{ name: `${lang.links}`, value: `**[${lang.officialServer}](https://discord.gg/rqAq934gEk) - [${lang.inviteUs}](https://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=272100438) - [${lang.buyVIP}](https://www.patreon.com/suicidekiss)**` }
			);

		interaction.reply({ embeds: [commandsEmbed] });
	}
};