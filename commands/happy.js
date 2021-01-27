module.exports = {
	name: 'happy',

	execute(bot, message, command, db, lang) {
		const rnd = Math.floor(Math.random() * 6);

		return message.channel.send(`${message.author}${lang.happy.isHappy}`, { files: [`img/actions/${command.name} (${rnd}).gif`] }).catch(err => { console.error(err); });
	},
};