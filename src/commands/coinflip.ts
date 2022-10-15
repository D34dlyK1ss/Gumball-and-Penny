import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getText from '../functions/getText';
import enLang from '../lang/en.json';

const least = 50;
const most = 1000;

export = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription(enLang.command.coinflip.description)
		.addStringOption(option =>
			option.setName('guess')
				.setDescription(enLang.command.coinflip.guessDesc)
				.setChoices(
					{ name: 'Heads', value: 'Heads' },
					{ name: 'Tails', value: 'Tails' }
				)
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription(enLang.command.coinflip.amountDesc)
				.setMinValue(least)
				.setMaxValue(most)
				.setRequired(true)
		),

	execute(bot: undefined, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		const ref = db.collection('perfis').doc(interaction.user.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				interaction.reply(lang.error.noProfile);
			}
			else {
				const money = Math.floor(interaction.options.getInteger('amount'));
				const bal = doc.get('balance') as number;

				if (bal + money > 1000000) {
					interaction.reply(lang.error.noAdd);
				}
				else if (money > bal) {
					interaction.reply(lang.error.noMoney);
				}
				else {
					interaction.reply({ files: ['src/img/coinflip/animation.gif'] }).then(() => {
						const guess = interaction.options.getString('guess');
						const res = Math.round(Math.random()) ? 'Heads' : 'Tails';
						const messageRes = lang.coinflip[res];
						const imageRes = `src/img/coinflip/${res}.gif`;

						setTimeout(async () => {
							if (lang.coinflip[res] !== guess) {
								ref.update({
									balance: bal - money
								});
								
								await interaction.editReply({ content: `${messageRes}! ${getText(lang.lost, [money])}`, files: [imageRes] });
							}
							else if (lang.coinflip[res] === guess) {
								const won = money * 1.5;

								ref.update({
									balance: bal + won
								});
								
								await interaction.editReply({ content: `${messageRes}! ${getText(lang.won, [won])}`, files: [imageRes] });
							}
						}, 2000);
					});
				}
			}
		});
	}
};