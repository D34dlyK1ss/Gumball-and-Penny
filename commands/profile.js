const Discord = require('discord.js');

module.exports = {
	name: 'profile',
	aliases: ['p'],
	category: 'Utilidade',
	description: 'Vê o teu perfil ou o de alguém!\nOpções disponíveis: `create`, `setnickname`, `setdescription`',
	usage: '`+profile [opcional - opção | @utilizador]`',

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
						'balance': 0,
						'description': 'N/A',
						'id': user.id,
						'lastDaily': new Date(1970, 0, 1, 0, 0, 0, 0),
						'name': user.username,
						'nickname': 'N/A',
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
						'nickname': args,
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
						'description': args,
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
						message.channel.send('Ainda não criaste um perfil! Para criares um perfil usa `+profile create`!');
					}
					else if (user.id == 679041548955942914) {
						message.channel.send('Nós não precisamos de ter um perfil!');
					}
					else if (user.bot) {
						message.channel.send('Os bots não criam perfis! 😂 ');
					}
					else {
						message.channel.send('Este utilizador ainda não criou um perfil!');
					}
				}
				else {
					const nick = doc.get('nickname'),
						desc = doc.get('description'),
						bal = doc.get('balance');
					const embed = new Discord.MessageEmbed()
						.setColor('#8000ff')
						.setAuthor(`${user.tag}`)
						.setThumbnail(`${user.displayAvatarURL()}`)
						.addFields(
							{ name: 'Alcunha', value: `${nick}` },
							{ name: 'Descrição', value: `${desc}` },
							{ name: 'Capital', value: `¤${bal}` },
						);

					message.channel.send(embed);
				}
			});
			break;
		}
	},
};