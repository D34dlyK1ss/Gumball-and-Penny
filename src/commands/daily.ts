import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import ms from 'ms';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

const daily = 300;

export = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription(enLang.command.daily.description),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const ref = db.collection('perfis').doc(interaction.user.id);
		
		ref.get().then(doc => {
			const today = Date.now();
			const lastDaily: number = doc.get('lastDaily');
			const nextDaily = lastDaily + 86400000;

			if (!doc.exists) {
				interaction.reply(lang.error.noProfile);
			}
			else if (today < nextDaily) {
				interaction.reply(getText(lang.command.daily.againIn, [ms(nextDaily - today)]));
			}
			else {
				const bal: number = doc.get('balance');
		
				if (bal + daily > 1000000) {
					interaction.reply(lang.error.noAdd);
				}
				else {
					ref.update({
						balance: bal + daily,
						lastDaily: today
					}).then(() => {
						interaction.reply(getText(lang.command.daily.received, [daily]));
					});
				}
			}
		});
	}
};