import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'index';
import getText from '../functions/getText';
import botConfig from '../../botConfig.json';
import enLang from '../lang/en.json';

export = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription(enLang.command.give.description)
		.addUserOption(option =>
			option.setName('member')
				.setDescription(enLang.command.give.memberDesc)
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription(enLang.command.give.amountDesc)
				.setRequired(true)
		),

	execute(bot: BotClient, interaction: ChatInputCommandInteraction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>) {
		let amount = interaction.options.getInteger('amount');
		const user = interaction.options.getUser('member');
		const refD = db.collection('perfis').doc(interaction.user.id);

		refD.get().then(docD => {
			if (!docD.exists) {
				interaction.reply(lang.error.noProfile);
			}
			else if (interaction.user.id == user.id) {
				interaction.reply(lang.command.give.self);
			}
			else if (user === bot.user) {
				interaction.reply(lang.command.give.thanksBut);
			}
			else if (user.bot) {
				interaction.reply(lang.botsNoProfile);
			}
			else {
				const refU = db.collection('perfis').doc(user.id);

				refU.get().then(docU => {
					if (!docU.exists) {
						interaction.reply(getText(lang.error.userHasNoProfile, [user.tag]));
					}
					else {
						const balD: number = docD.get('balance');
						const balU: number = docU.get('balance');

						if (amount > balD) {
							interaction.reply(lang.error.noMoney);
						}
						else if (balU === 1000000 || botConfig.botOwnerID === user.id ) {
							interaction.reply(getText(lang.error.cannotGive, [user.tag]));
						}
						else {
							let newBalU = balU + amount;

							if (balU + amount > 1000000) {
								newBalU = 1000000;
								amount = newBalU - balU;
							}

							refU.update({
								balance: newBalU
							}).then(() => {
								refD.update({
									balance: balD - amount
								}).then(() => {
									interaction.reply(getText(lang.command.give.youGave, [amount, user.tag]));
								});
							});
						}
					}
				});
			}
		});
	}
};