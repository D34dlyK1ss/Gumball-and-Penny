import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';
import text from '../src/functions/text';

export const name = 'give';
export function execute(bot: BotClient, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const donor = message.author;
	if (!args[0]) message.reply(lang.error.noMention);
	const user = message.mentions.users.first();
	const refD = db.collection('perfis').doc(donor.id);
	let amount = Math.abs(parseInt(args[1]));

	refD.get().then(docD => {
		if (!docD.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`);
		}
		else if (!user || !Number.isInteger(amount)) {
			message.reply(`${lang.error.wrongSyntax}\`${prefix}${lang.command[command.name].usage}\``);
		}
		else {
			const refU = db.collection('perfis').doc(user.id);

			refU.get().then(docU => {
				if (message.author.id == user.id) {
					message.reply(`${lang.give.self}`);
				}
				else if (user === bot.user) {
					message.reply(`${lang.give.thanksBut} 😁`);
				}
				else if (user.bot) {
					message.reply(lang.botsNoProfile);
				}
				else if (!args[1]) {
					message.reply(`${lang.error.wrongSyntax}\`${prefix}${lang.command[command.name].usage}\``);
				}
				else if (!docU.exists) {
					message.reply(`**${user.tag}**${lang.error.userNoProfile}`);
				}
				else {
					const balD: number = docD.get('balance');
					const balU: number = docU.get('balance');

					if (amount > balD) {
						message.reply(lang.error.noMoney);
					}
					else if (balU === 1000000) {
						message.reply(`${lang.error.noGive}**${user.tag}**! 😧`);
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
								message.reply(text(lang.give.youGave, [amount, user.tag]));
							});
						});
					}
				}
			});
		}
	});
}