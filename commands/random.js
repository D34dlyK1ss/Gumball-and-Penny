module.exports = {
	name: 'random',
	category: 'Diversão',
	description: 'Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100',
	usage: '`+random [opcional - número]`',

	execute(bot, message, command, args) {
		let rnd;
		if (args == '') {
			rnd = Math.floor(Math.random() * 100) + 1;
		}
		else {
			rnd = Math.floor(Math.random() * args) + 1;
		}
		message.channel.send(`${rnd}!`);
	},
};