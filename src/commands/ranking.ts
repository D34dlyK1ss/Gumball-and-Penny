import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import moment from 'moment';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

let lastUpdateAt = 0;
const rankingEmbed = new EmbedBuilder()
	.setColor('DarkPurple')
	.setThumbnail('https://i.imgur.com/0lJXooH.png');

export = {
	data: new SlashCommandBuilder()
		.setName('ranking')
		.setDescription(enLang.command.ranking.description)
		.addStringOption(option => 
			option.setName('option')
				.setDescription(enLang.command.ranking.optionDesc)
				.setChoices(
					{ name: 'XP', value: 'XP' },
					{ name: enLang.balance, value: enLang.balance }
				)
				.setRequired(true)
		),

	async execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string) {
		await interaction.deferReply();
		moment.locale(language);
		
		const refP = db.collection('perfis');
		
		let i = 0;
		let column = '';
		let column2 = '';

		if (interaction.options.getString('XP')) {
			const query = await refP.orderBy('xp', 'desc').limit(10).get();
			const users: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
			query.forEach((doc) => users.push(doc));

			if (Date.now() - lastUpdateAt > 1800000) {
			
				for (const doc of users) {
					const user = await bot.users.fetch(doc.id);

					i++;
					column += `${i}. ${user.tag}\n`;
					column2 += `${doc.get('xp')} XP, ${lang.level} ${doc.get('level')}\n`;
				}
				
				lastUpdateAt = Date.now();

				rankingEmbed
					.setFields([
						{ name: 'Top 10', value: column, inline: true },
						{ name: 'XP', value: column2, inline: true }
					])
					.setFooter({ text: getText(lang.command.ranking.updatedAt, [moment(lastUpdateAt).utc().format('LL'), moment(lastUpdateAt).utc().format('LTS')]) });
			}
		}
		else {
			const query = await refP.orderBy('balance', 'desc').limit(10).get();
			const users: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
			query.forEach((doc) => users.push(doc));

			if (Date.now() - lastUpdateAt > 1800000) {			
				for (const doc of users) {
					const user = await bot.users.fetch(doc.id);

					i++;
					column += `${i}. ${user.tag}\n`;
					column2 += `¤${doc.get('balance')}, ${lang.level} ${doc.get('level')}\n`;
				}

				lastUpdateAt = Date.now();

				rankingEmbed
					.setFields([
						{ name: 'Top 10', value: column, inline: true },
						{ name: lang.balance, value: column2, inline: true }
					])
					.setFooter({ text: getText(lang.command.ranking.updatedAt, [moment(lastUpdateAt).utc().format('LL'), moment(lastUpdateAt).utc().format('LTS')]) });
			}
		}
		
		await interaction.editReply({ embeds: [rankingEmbed] });
	}
};