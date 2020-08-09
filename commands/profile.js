const Discord = require('discord.js');

module.exports = {
	name: 'profile',
	aliases: ['p'],
	category: 'Perfil',
	description: 'Vê o teu perfil ou o de alguém!\nOpções disponíveis: `create`, `setnickname`, `setdescription`',
	usage: '`+profile [opcional - opção | @membro]`',

	execute(bot, message, command, args, db) {
		const user = message.mentions.users.first() || message.author,
			ref = db.collection('perfis').doc(user.id),
			option = args[0];
		args = args.slice(1);
		args = args.join(' ');

		switch (option) {
		case 'create':
			ref.get().then(doc => {
				if (doc.exists) {
					if (user == message.author) {
						message.channel.send('Já tens um perfil criado, não podes criar outro! 💢');
					}
				}
				else {
					db.collection('perfis').doc(message.author.id).set({
						balance: 0,
						description: 'N/A',
						id: user.id,
						lastDaily: '01/01/1970',
						level: 1,
						name: user.tag,
						nickname: 'N/A',
						xp: 0,
					}).then(() => {
						message.reply('o teu perfil foi criado! Adiciona uma descricão com `+profile setdescription [descrição]`!');
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setnickname':
			if (args == '') args = 'N/A';
			ref.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						nickname: args,
					}).then(() => {
						message.reply('a tua alcunha foi alterada!');
					}).catch(err => { console.error(err); });
				}
			});
			break;
		case 'setdescription':
			ref.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
				}
				else {
					db.collection('perfis').doc(message.author.id).update({
						description: args,
					}).then(() => {
						message.reply('a tua descrição foi alterada!');
					}).catch(err => { console.error(err); });
				}
			});
			break;
		default:
			ref.get().then(doc => {
				if (!doc.exists) {
					if (user == message.author) {
						message.reply('ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
					else if (user == bot.user) {
						message.reply('nós não precisamos de ter um perfil!');
					}
					else if (user.bot) {
						message.reply('os bots não criam perfis! 😂 ');
					}
					else {
						message.reply(`${user} ainda não criou um perfil!`);
					}
				}
				else {
					const nick = doc.get('nickname'),
						desc = doc.get('description'),
						bal = doc.get('balance'),
						level = doc.get('level');
					const embed = new Discord.MessageEmbed()
						.setColor('#8000ff')
						.setAuthor(`${user.tag}`)
						.setThumbnail(`${user.displayAvatarURL()}`)
						.addFields(
							{ name: 'Alcunha', value: `${nick}` },
							{ name: 'Descrição', value: `${desc}` },
							{ name: 'Nível', value: `${level}` },
							{ name: 'Capital', value: `¤${bal}` },
						);

					message.channel.send(embed);
				}
			});
			break;
		}
	},
};