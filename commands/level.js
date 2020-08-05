const Discord = require('discord.js');

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
						.setDescription(`Estás a nível **${level}**\n**${xp} xp**`)
						.addFields(
							{ name: 'XP para o próximo nível', value: nextLevel - xp },
						);

				message.channel.send(embed);
			}
		});
	},
};