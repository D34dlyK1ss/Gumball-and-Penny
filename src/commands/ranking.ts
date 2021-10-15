import { Message, MessageEmbed } from 'discord.js';
import { BotClient } from 'index';
import moment from 'moment';
import getText from '../functions/getText';

export const name = 'ranking';
export const aliases = ['leaderboard'];

let lastUpdateAt = 0;
const rankingEmbed = new MessageEmbed()
	.setColor('DARK_PURPLE')
	.setThumbnail('https://i.imgur.com/0lJXooH.png');

export async function execute(bot: BotClient, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string) {
	moment.locale(language);

	const refP = db.collection('perfis');
	const query = await refP.orderBy('xp', 'desc').limit(10).get();
	let column = '';
	let column2 = '';
	let i = 0;

	if (Date.now() - lastUpdateAt > 1800000) {
		rankingEmbed.spliceFields(0, 10);
		query.forEach(async doc => {
			i++;
			column += `${i}. ${(await bot.users.cache.fetch(doc.id)).tag}\n`;
			column2 += `${doc.get('xp')} XP, ${lang.level} ${doc.get('level')}\n`;
		});
		
		lastUpdateAt = Date.now();

		rankingEmbed
			.addFields([
				{ name: 'Top 10', value: column, inline: true },
				{ name: 'XP', value: column2, inline: true },
			])
			.setFooter(getText(lang.ranking.updatedAt, [moment(lastUpdateAt).utc().format('LL'), moment(lastUpdateAt).utc().format('LTS')]));
	}

	message.channel.send({ embeds: [rankingEmbed] });
}