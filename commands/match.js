module.exports = {
	name: 'match',

	execute(bot, message, command, db, lang) {
		const other = message.mentions.users.first();

		if (!other) {
			return message.reply(lang.error.noMention).catch(err => { console.error(err); });
		}
		else {
			const last = parseInt(message.member.id.slice(-1)),
				otherLast = parseInt(other.id.slice(-1));
			let number = `${Math.abs(last - otherLast) * 30}`;

			if (number > 100) number = number.substr(1);

			if (other == message.author) {
				return message.reply(lang.error.noSelf).catch(err => { console.error(err); });
			}
			else if (other == bot.user) {
				return message.channel.send(lang.match.alreadyAPair).catch(err => { console.error(err); });
			}
			else if (other.bot) {
				return message.reply(lang.error.wontWorkOnBot).catch(err => { console.error(err); });
			}
			else {
				message.reply(`${lang.match.youAre}**${number}%**${lang.match.compatibleWith}${other}!`).catch(err => { console.error(err); });
			}
		}
	},
};