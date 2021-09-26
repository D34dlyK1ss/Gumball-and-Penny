import { Message, MessageEmbed } from 'discord.js';

export const name = 'ranking';
export const aliases = ['leaderboard'];

let isCached = true;
const rankingEmbed = new MessageEmbed()
	.setColor('DARK_PURPLE');

export async function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
	const refP = db.collection('perfis');
	const query = await refP.orderBy('xp', 'desc').limit(10).get();
	let i = 0;

	if (isCached === false) {
		query.forEach(doc => {
			i++;
			rankingEmbed.addField(`\n${i}# ${doc.get('name')}`, `${lang.level} ${doc.get('level')}, ${doc.get('xp')} XP`);
		});

		isCached = true;
		setTimeout(() => {
			isCached = false;
		}, 1800000);
	}

	rankingEmbed.setTitle(lang.ranking.title)
		.setDescription(lang.ranking.description);

	message.channel.send({ embeds: [rankingEmbed] });
}