module.exports = {
	name: 'random',
	category: 'Fun',
	description: 'We\'re going to pick a number between 1 and the defined number. The default is 100',
	usage: 'random [optional - number]',

	execute(bot, message, command, args) {
		let rnd;
		if (args == '') {
			return rnd = Math.floor(Math.random() * 100) + 1;
		}
		else if (!Number.isInteger(rnd)) {
			return message.reply('that\'s not a number!');
		}
		else {
			rnd = Math.floor(Math.random() * args) + 1;
		}
		message.channel.send(`${rnd}!`);
	},
};