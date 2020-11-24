module.exports = {
	name: 'fact',
	category: 'Diversão',
	description: '**Factos**',
	usage: 'fact',

	execute(bot, message) {
		const rnd = Math.floor(Math.random() * 17),
			facts = require('../facts.json');

		message.channel.send(facts[rnd]).catch();
	},
};