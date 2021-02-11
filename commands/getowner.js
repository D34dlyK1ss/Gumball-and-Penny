const config = require('../config.json');

module.exports = {
	name: 'getowner',

	async execute(bot, message, command, db, lang, language, prefix, args) {
		if(message.author.id !== config.botOwner || message.channel.id !== '809182965607039007') return;

		const server = await bot.guilds.cache.get(args[0]);

		if (!server) return message.channel.send('O bot não está no servidor ou então não está na cache!').catch(err => { console.error(err); });

		message.channel.send(server.owner.id).catch(err => { console.error(err); });
	},
};