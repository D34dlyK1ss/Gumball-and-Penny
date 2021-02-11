const config = require('../config.json');

module.exports = {
	name: 'getowner',

	async execute(bot, message, command, db, lang, language, supportServer, prefix, args) {
		if(message.author != config.botOwner) return;
		const server = await bot.guilds.cache.get(args[0]);
		message.channel.send(server.owner.id);
	},
};