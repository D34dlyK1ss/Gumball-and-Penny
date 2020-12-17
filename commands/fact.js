module.exports = {
	name: 'fact',

	execute(bot, message, command, db, lang, language) {
		const rnd = Math.floor(Math.random() * 17),
			facts = require('../src/facts.json');

		message.channel.send(facts[language][rnd]).catch();
	},
};