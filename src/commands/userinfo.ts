import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription(enLang.command.userinfo.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.userinfo.memberDesc)
		),
			
	async execute(bot: undefined, interaction: ChatInputCommandInteraction, db: undefined, lang: Record<string, string | any>, language: string) {
		const user = interaction.options.getUser('member') || interaction.user;
		const member = await interaction.guild.members.fetch(user);
		const createdDate = moment(user.createdAt).locale(language);
		const joinedDate = moment(member.joinedAt).locale(language);
		const createdAgo = createdDate.from(Date.now());
		const joinedAgo = joinedDate.from(Date.now());
		const allRoles = member.roles.cache.filter(role => role.id !== interaction.guildId).map(r => r.toString());
		const nickname = member.nickname;
		
		const embed = new EmbedBuilder()
			.setColor('DarkPurple')
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setThumbnail(`${user.displayAvatarURL()}`)
			.addFields(
				{ name: lang.id, value: user.id },
				{ name: lang.nickname, value: nickname ? nickname : lang.command.userinfo.none, inline: true },
				{ name: lang.joinDate, value: getText(lang.command.userinfo.joined, [joinedAgo, joinedDate.format('LLLL')]) },
				{ name: lang.roles, value: allRoles.length > 0 ? `${allRoles}` : lang.command.userinfo.none }
			)
			.setFooter({ text: getText(lang.command.userinfo.created, [createdAgo, createdDate.format('LLLL')]) });
		
		interaction.reply({ embeds: [embed] });
	}
};