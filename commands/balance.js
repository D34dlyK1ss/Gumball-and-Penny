module.exports = {
	name: 'balance',
	aliases: ['bal'],

	execute(bot, message, command, db, lang, supportServer, prefix) {
		const user = message.author,
			ref = db.collection('perfis').doc(user.id);

		ref.get().then(doc => {
			if (!doc.exists) {
				return message.reply(`${lang.error.noProfile}\`${prefix}profile create\`!`).catch();
			}
			else {
				const bal = doc.get('balance');
				message.reply(`${lang.balance.have}**¤${bal}**.`).catch();
			}
		});
	},
};
