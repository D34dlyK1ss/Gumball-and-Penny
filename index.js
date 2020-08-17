// Biblioteca do Discord.js
const Discord = require('discord.js');

// Cliente
const bot = new Discord.Client();

// Propriedades default do bot
const config = require('./config.json');

// Recompensas de nível
const rewards = require('./rewards.json');

// Biblioteca para horários
const schedule = require('node-schedule');

// Biblioteca para momentos
const moment = require('moment');
moment.locale('pt');

// Biblioteca para sistema de ficheiros
const fs = require('fs');

// Classe de utilidade 'Collection' do Discord.js
bot.commands = new Discord.Collection();

// Acesso de administrador à BD
const admin = require('firebase-admin');

// Chaves de autenticação à BD
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
	// Autenticação à BD
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://gumball-and-penny.firebaseio.com',
});

const db = admin.firestore();

// Leitura dos ficheiros de comandos
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
if (commandFiles.length === 0) return;
for (const file of commandFiles) {
	const props = require(`./commands/${file}`);
	bot.commands.set(props.name, props);
}

// Uma vez que o bot está ativo:
bot.once('ready', async () => {
	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);

	bot.user.setActivity('+help');

	const currentdate = new Date(),
		relationship = new Date(2019, 11, 28),
		mili = currentdate - relationship;

	const months = Math.round(mili / 2629746000),
		// eslint-disable-next-line no-unused-vars
		years = Math.round(mili / 31536000000);

	schedule.scheduleJob('0 14 28 * *', function() {
		bot.users.resolve(config.lilly).send(`:tada: Parabéns Lilly! Completaste ${months} meses com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
		bot.users.resolve(config.botOwner).send(`:tada: Parabéns Ruru! Completaste ${months} meses com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
	});
});


const xpCooldown = new Set();

// Ações para quando o bot receber uma mensagem
bot.on('message', async message => {

	// Ignorar mensagens privadas e mensagens de outros bots
	if (message.channel.type === 'dm' || message.author.bot) return;

	db.collection('perfis').doc(message.author.id).get().then(doc => {
		if (!doc.exists) {
			return;
		}
		else {
			const name = db.collection('perfis').doc(message.author.id).get('name');

			if (message.author.tag != name) {
				db.collection('perfis').doc(message.author.id).update({
					name: message.author.tag,
				});
			}
		}
	});

	let prefix;
	const ref = db.collection('servidores').doc(message.guild.id);

	ref.get().then(doc => {
		// Obter o prefixo definido para o servidor
		prefix = doc.get('prefix');
	}).then(() => {
		// Ignorar mensagens que não começam com o prefixo
		if (!message.content.startsWith(prefix)) return;

		const array = message.content.split(' '),
			commandName = array[0].slice(prefix.length).toLowerCase(),
			args = array.slice(1);
		const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Ignorar mensagem se o bot não tiver tal comando
		if (!command) return;

		// Adicionar XP ao perfil do utilizador
		db.collection('perfis').doc(message.author.id).get().then(doc => {
			if (!doc.exists) {
				return;
			}
			else {
				const rewardsArray = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
					level = doc.get('level'),
					xp = doc.get('xp'),
					add = Math.floor(Math.random() * 11) + 50;
				const newXP = xp + add;

				if (newXP > 2000000) return;

				const newLevel = Math.floor(Math.sqrt(newXP / 2000000) * 100);

				db.collection('perfis').doc(message.author.id).update({
					xp: newXP,
				});

				if (newLevel != level) {
					db.collection('perfis').doc(message.author.id).update({
						level: newLevel,
					});

					if (newLevel > level) {
						const bal = doc.get('balance'),
							stringLevel = newLevel.toString(),
							reward = rewards[`Level ${level}`];

						if (rewardsArray.includes(stringLevel)) {
							db.collection('perfis').doc(message.author.id).update({
								balance: bal + reward,
							});
							message.channel.send(`🎉 Parabéns ${message.author}, subiste para o nível ${newLevel} e recebeste ¤${reward} 🆙💰`);
						}
						else {
							message.channel.send(`🎉 Parabéns ${message.author}, subiste para o nível ${newLevel}! 🆙`);
						}
					}
				}
			}
		}).then (() => {
			if (!xpCooldown.has(message.author.id)) {

				xpCooldown.add(message.author.id);
				setTimeout(() => {
					xpCooldown.delete(message.author.id);
				}, 60000);
			}

			try {
				command.execute(bot, message, command, args, db);
			}
			catch (err) {
				console.error(err);
				message.reply('ocorreu um erro ao tentar executar esse comando!');
			}
		});
	});

	const pic = new Discord.MessageAttachment(`images/${message.content}.png`);

	// Responder de acordo com o conteúdo da mensagem lida
	switch (message.content) {
	case 'shine':
		message.channel.send(pic);
		break;
	case 'boi':
		message.channel.send(pic);
		break;
	case 'just monika':
		message.channel.send(pic);
		break;
	case 'no u':
		message.channel.send(pic);
		break;
	case 'E':
		message.channel.send(pic);
		break;
	case 'hmm':
		message.channel.send(pic);
		break;
	case 'noice':
		message.channel.send(pic);
		break;
	}

	const gName = ref.get('guildName'),
		oName = ref.get('guildOwner'),
		oID = ref.get('guildOwnerID'),
		mCount = ref.get('memberCount');

	// Atualizar o nome do servidor
	if (message.guild.name != gName) {
		ref.update({
			guildName: message.guild.name,
		});
	}

	// Atualizar o nome do proprietário do servidor
	if (message.guild.owner.user.tag != oName) {
		ref.update({
			guildOwner: message.guild.owner.user.tag,
		});
	}

	// Atualizar o ID do proprietário do servidor
	if (message.guild.owner.user.id != oID) {
		ref.update({
			guildOwnerID: message.guild.owner.user.id,
		});
	}

	// Atualizar o número de membros do servidor
	if (message.guild.members != mCount) {
		ref.update({
			memberCount: message.guild.memberCount,
		});
	}
});

// Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
bot.on('guildCreate', async guildData => {
	db.collection('servidores').doc(guildData.id).set({
		'guildID': guildData.id,
		'guildName': guildData.name,
		'guildOwner': guildData.owner.user.tag,
		'guildOwnerID': guildData.owner.user.id,
		'memberCount': guildData.memberCount,
		'prefix': '+',
	});
});

// Autenticação do bot
bot.login(config.token);
