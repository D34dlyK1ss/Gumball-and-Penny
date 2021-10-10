import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import getText from '../functions/getText';

export const name = 'ranking';
export const aliases = ['leaderboard'];

let lastUpdateAt = 0;
const rankingEmbed = new MessageEmbed()
	.setColor('DARK_PURPLE');

export async function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string) {
	moment.locale(language);

	const refP = db.collection('perfis');
	const query = await refP.orderBy('xp', 'desc').limit(10).get();
	let i = 0;

	if (Date.now() - lastUpdateAt > 1800000) {
		rankingEmbed.spliceFields(0, 10);
		query.forEach(doc => {
			i++;
			rankingEmbed.addField(`\n${i}# ${doc.get('name')}`, `${lang.level} ${doc.get('level')}, ${doc.get('xp')} XP`);
		});

		lastUpdateAt = Date.now();
		rankingEmbed.setFooter(getText(lang.ranking.updatedAt, [moment(lastUpdateAt).utc().format('LL'), moment(lastUpdateAt).utc().format('LTS')]));
	}

	rankingEmbed.setTitle(lang.ranking.title)
		.setDescription(lang.ranking.description);

	message.channel.send({ embeds: [rankingEmbed] });
}