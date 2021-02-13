module.exports = {
	name: 'vip',

	execute(bot, message) {
		message.channel.send('https://www.patreon.com/join/suicidekiss').catch(err => { console.error(err); });
	},
};
