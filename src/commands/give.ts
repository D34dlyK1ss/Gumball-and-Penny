import { Message, User } from 'discord.js';
import { BotClient, Cmd } from 'index';
import getText from '../functions/getText';
import botConfig from '../../botConfig.json';

export const name = 'give';
export function execute(bot: BotClient, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const donor = message.author;
	let amount = Math.abs(parseInt(args[1]));

	if (!args[0] || !args[1] || !Number.isInteger(amount)) {
		message.reply(getText(lang.error.wrongSyntax, [prefix, lang.command[command.name].usage]));
	}
	else {
		const user = message.mentions.users.first() as User;
		const refD = db.collection('perfis').doc(donor.id);

		refD.get().then(docD => {
			if (!docD.exists) {
				message.reply(getText(lang.error.noProfile, [prefix]));
			}
			else if (!args[1] || !Number.isInteger(amount)) {
				message.reply(getText(lang.error.wrongSyntax, [prefix, lang.command[command.name].usage]));
			}
			else if (message.author.id == user.id) {
				message.reply(lang.give.self);
			}
			else if (user === bot.user) {
				message.reply(lang.give.thanksBut);
			}
			else if (user.bot) {
				message.reply(lang.botsNoProfile);
			}
			else {
				const refU = db.collection('perfis').doc(user.id);

				refU.get().then(docU => {
					if (!docU.exists) {
						message.reply(getText(lang.error.userNoProfile, [user.tag]));
					}
					else {
						const balD: number = docD.get('balance');
						const balU: number = docU.get('balance');

						if (amount > balD) {
							message.reply(lang.error.noMoney);
						}
						else if (balU === 1000000 || botConfig.botOwnerID === user.id ) {
							message.reply(getText(lang.error.cantGive, [user.tag]));
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
									message.reply(getText(lang.give.youGave, [amount, user.tag]));
								});
							});
						}
					}
				});
			}
		});
	}
}