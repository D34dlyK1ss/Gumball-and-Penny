module.exports = {
	name: 'which',
	aliases: ['w'],
	category: 'Diversão',
	description: 'Com este comando podes saber que personagem de anime és!\nAnimes disponíveis: `akame ga kill`, `code geass`, `death note`, `higurashi` , `jojo`, `kakegurui`, `mirai nikki`, `noragami`, `one punch man`, `psycho-pass`, `steins;gate`',
	usage: 'which [anime]',

	execute(bot, message, command, args, db, prefix) {
		args = args.join(' ');
		args = args.toLowerCase();
		const last = message.member.id.slice(-1),
			which = require('../which.json');

		if (args == null || args == '' || !which[args]) {
			return message.reply(`tens de mencionar um anime disponível! Usa \`${prefix}help which\` para mais informação.`);
		}
		else {
			message.channel.send(`És ${which[args][last]}!`, { files: [`images/which/${args} (${last}).jpg`] });
		}
	},
};