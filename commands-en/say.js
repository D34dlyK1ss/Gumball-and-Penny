module.exports = {
	name: 'say',
	category: 'Fun',
	description: 'That\'ll make us say anything you want! :slight_smile:',
	usage: 'say [message]',

	execute(bot, message, command, args) {
		message.delete();
		if (args == null || args == '') {
			return message.reply('you didn\'t write anything!').then(msg => msg.delete({ timeout: 5000 }));
		}
		else if (args[0].startsWith('http')) {
			return message.reply('we can write any links!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			message.channel.send(args.join(' '));
		}
	},
};
