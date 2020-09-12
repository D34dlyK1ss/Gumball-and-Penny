module.exports = {
	name: 'random',
	category: 'Diversão',
	description: 'Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100',
	usage: 'random [opcional - número]',

	execute(bot, message, command, args) {
		let rnd;
		if (args == '') {
			return rnd = Math.floor(Math.random() * 100) + 1;
		}
		else if (!Number.isInteger(rnd)) {
			return message.reply('isso não é um número!');
		}
		else {
			rnd = Math.floor(Math.random() * args) + 1;
		}
		message.channel.send(`${rnd}!`);
	},
};