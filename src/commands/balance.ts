import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription(enLang.command.balance.description),
	
	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const ref = db.collection('perfis').doc(interaction.user.id);
	
		ref.get().then(doc => {
			if (!doc.exists) {
				interaction.reply(lang.error.noProfile);
			}
			else {
				const bal = doc.get('balance');
				const embed = new EmbedBuilder()
					.setTitle(lang.command.balance.yourBalance)
					.setColor('DarkPurple')
					.setThumbnail(interaction.user.displayAvatarURL())
					.setDescription(`<a:gpCoin:898355693193662464>${bal}`);
	
				interaction.reply({ embeds: [embed] });
			}
		});
	}
};
