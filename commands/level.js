const Discord = require('discord.js');

function convert(value) {
	if (value >= 1000000) {
		value = (value / 1000000) + 'M';
	}
	else if (value >= 1000) {
		value = (value / 1000) + 'k';
	}
	return value;
}

module.exports = {
	name: 'level',
	category: 'Perfil',
	description: 'Verifica o teu nível e XP!',
	usage: '`+level`',
	execute(bot, message, command, args, db) {
		db.collection('perfis').doc(message.author.id).get().then(doc => {
			if (!doc.exists) {
				message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
			}
			else {
				const level = doc.get('level'),
					xp = doc.get('xp');
				const nextLevel = 500 * Math.round(level * (level + 1) / 2),
					embed = new Discord.MessageEmbed()
						.setColor('#8000ff')
						.setAuthor(message.author.tag)
						.setThumbnail(`${message.author.displayAvatarURL()}`)
						.addFields(
							{ name: `Estás a nível **${level}**`, value: `${convert(xp)} XP` },
							{ name: 'XP para o próximo nível', value: `${convert(nextLevel - xp)} XP` },
						);

				message.channel.send(embed);
			}
		});
	},
};
