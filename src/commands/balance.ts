import { Message, MessageEmbed } from 'discord.js';
import getText from '../functions/getText';

export const name = 'balance';
export const aliases = ['bal'];
export function execute(bot: undefined, message: Message, command: undefined, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string) {
	const user = message.author;
	const ref = db.collection('perfis').doc(user.id);

	ref.get().then(doc => {
		if (!doc.exists) {
			message.reply(getText(lang.error.noProfile, [prefix]));
		}
		else {
			const bal = doc.get('balance');
			const embed = new MessageEmbed()
				.setTitle(lang.balance.yourBalance)
				.setColor('DARK_PURPLE')
				.setThumbnail(message.author.displayAvatarURL())
				.setDescription(`<a:gpCoin:898355693193662464>${bal}`);

			message.reply({ embeds: [embed] });
		}
	});
}
