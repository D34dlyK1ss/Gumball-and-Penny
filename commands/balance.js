module.exports = {
	name: 'balance',
	aliases: ['bal'],

	execute(bot, message, command, db, lang, language, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch(err => { console.error(err); });
			}
			else {
				const bal = doc.get('balance');
				message.reply(`${lang.balance.have}**¤${bal}**.`).catch(err => { console.error(err); });
			}
		});
	},
};
