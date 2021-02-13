module.exports = {
	name: 'vip',

	execute(bot, message) {
		message.channel.send('https://www.patreon.com/suicidekiss').catch(err => { console.error(err); });
	},
};
