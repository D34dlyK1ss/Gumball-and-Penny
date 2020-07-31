const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	category: 'Moderação',
	description: 'Expulsaremos um membro do servidor!',
	usage: '`+kick [@utilizador] [opcional - razão]`',

	execute(bot, message, command, args) {
		message.delete();
		args.shift();
		const mention = message.mentions.users.first();
		const member = message.guild.member(mention);
		let	reason = args.join(' ');

		if (!message.member.hasPermission('KICK_MEMBERS')) {
			message.reply('não tens permissão para usar este comando! 💢').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else if (mention == null) {
			message.reply('tens de mencionar quem queres expulsar!').then(msg => msg.delete({ timeout: 5000 })).catch(err => { console.error(err); });
		}
		else {
			member.kick(reason).then(() => {
				if (reason == '') reason = '_Não indicada_';
				const embed = new Discord.MessageEmbed()
					.setColor('#8000ff')
					.setTitle(`${member.user.tag} foi expulso/a! 👋`)
					.setThumbnail(`${member.user.displayAvatarURL()}`)
					.setDescription(`por ${message.member.user.tag}`)
					.addFields(
						{ name: 'Razão', value: `${reason}` },
					);

				message.channel.send(embed);
			});
		}
	},
};
