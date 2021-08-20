import { Message } from 'discord.js';
import { BotClient, Cmd } from 'index';

export const name = 'give';
export function execute(bot: BotClient, message: Message, command: Cmd, db: any, lang: Record<string, string | any>, language: undefined, prefix: string, args: string[]) {
	const donor = message.author;
	if (!args[0]) message.reply(lang.error.noMention).catch(err => { console.error(err); });
	const user = message.mentions.users.first();
	const refD = db.collection('perfis').doc(donor.id);
	let amount = Math.abs(parseInt(args[1]));

	refD.get().then((docD: any) => {
		if (!docD.exists) {
			message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
		}
		else if (user === null || !Number.isInteger(amount)) {
			message.reply(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch(err => { console.error(err); });
		}
		else {
			const refU = db.collection('perfis').doc(user.id);

			refU.get().then((docU: any) => {
				if (user === bot.user) {
					message.reply(`${lang.give.thanksBut} 😁`).catch(err => { console.error(err); });
				}
				else if (user.bot) {
					message.reply(lang.botsNoProfile).catch(err => { console.error(err); });
				}
				else if (!args[1]) {
					message.reply(`${lang.error.wrongSyntax}\`${prefix + lang.command[command.name].usage}\``).catch(err => { console.error(err); });
				}
				else if (!docU.exists) {
					message.reply(`${user.tag}${lang.error.userNoProfile}`).catch(err => { console.error(err); });
				}
				else {
					const balD = docD.get('balance');
					const balU = docU.get('balance');

					if (amount > balD) {
						message.reply(lang.error.noMoney).catch(err => { console.error(err); });
					}
					else if (balU === 1000000) {
						message.reply(`${lang.error.noGive}${user.tag}! 😧`).catch(err => { console.error(err); });
					}
					else {

						let newBalU = balU + amount;

						if ((balU + amount) > 1000000) {
							newBalU = 1000000;
							amount = newBalU - balU;
						}

						refU.update({
							balance: newBalU,
						}).then(() => {
							refD.update({
								balance: balD - amount,
							}).then(() => {
								message.reply(`${lang.give.youGave}**¤${amount}**${lang.give.to}${user}!`).catch(err => { console.error(err); });
							});
						});
					}
				}
			});
		}
	});
}