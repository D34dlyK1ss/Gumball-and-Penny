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

const currentdate = new Date(),
	relationship = new Date(2019, 11, 28);
const mili = currentdate - relationship;

const months = Math.round(mili / 2629746000),
	// eslint-disable-next-line no-unused-vars
	years = Math.round(mili / 31536000000);

// Uma vez que o bot está ativo:
bot.once('ready', async () => {
	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);

	bot.user.setActivity(`+help em ${bot.guilds.cache.size} servidores!`);

	schedule.scheduleJob('0 14 28 * *', function() {
		bot.users.resolve(config.lilly).send(`:tada: Parabéns Lilly! Completaste ${months} meses com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
		bot.users.resolve(config.botOwner).send(`:tada: Parabéns Ruru! Completaste ${months} meses com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
	});
});

const EventSource = require('eventsource');

const eventSourceInit = { headers: { 'Authorization': 'Bearer 14aee8db11a152ed7f2d4ed23a839d58' } };
const es = new EventSource('https://api.pipedream.com/sources/dc_OLuY0W/sse', eventSourceInit);

es.onopen = () => {
	console.log('Atentos ao fluxo SSE em https://api.pipedream.com/sources/dc_OLuY0W/sse');
};

es.onmessage = messageEvent => {
	const data = JSON.parse(messageEvent.data);
	const type = data.event.body.type,
		authorization = data.event.headers.authorization;
	let userID;

	if (authorization === 'Gumball&PennyDBL') {
		if (type != 'upvote') return;

		userID = data.event.body.user;

		const ref = db.collection('servidores').doc(userID);

		ref.get().then(doc => {
			if (!doc.exists) return;
			const bal = doc.get('balance');
			ref.update({
				balance: bal + 150,
			});
		});
	}
	else if (authorization === 'Gumball&PennyDonations') {
		userID = data.event.body.buyer_id;
		const ref = db.collection('vip').doc(userID),
			productID = data.event.body.txn_id,
			today = new Date();
		let date = 'forever';

		switch (productID) {
		case 'PiFQ9lClYG':
			today.setDate(today.getDate() + 30);
			date = moment(today).format('LL');
			break;
		case 'Jj-eRfAYxe':
			today.setDate(today.getDate() + 90);
			date = moment(today).format('LL');
			break;
		case '5rg_BbHarz':
			today.setDate(today.getDate() + 180);
			date = moment(today).format('LL');
			break;
		case '1_sR4NkivY':
			today.setDate(today.getDate() + 365);
			date = moment(today).format('LL');
			break;
		}

		ref.get().then(doc => {
			const guild = bot.guilds.cache.get('738540548305977366');
			const vipRole = guild.roles.cache.find(role => role.name === 'VIP');
			const member = guild.member(userID);

			if (!doc.exists) {
				db.collection('vip').doc(userID).set({
					vip: true,
					until: date,
				}).then(() => {
					if (!member) return;
					member.roles.add(vipRole);
				});
			}
			else {
				db.collection('vip').doc(userID).update({
					vip: true,
					until: date,
				}).then(() => {
					if (!member) return;
					member.roles.add(vipRole);
				});
			}
		});
	}
};

const prefixes = new Object(),
	languages = new Object(),
	xpCooldown = new Set();

// Ações para quando o bot receber uma mensagem
bot.on('message', async message => {

	// Ignorar mensagens privadas e mensagens de outros bots
	if (message.channel.type === 'dm' || message.author.bot) return;

	// Obter a linguagem a para o servidor
	const refL = db.collection('servidores').doc(message.guild.id);

	if (!languages[message.guild.id]) {
		const doc = await refL.get();
		languages[message.guild.id] = doc.get('language') || config.language;
	}

	const language = languages[message.guild.id] || config.language;

	// Leitura dos ficheiros de comandos
	const commandFiles = fs.readdirSync(`./commands-${language}`).filter(file => file.endsWith('.js'));
	if (commandFiles.length === 0) return;
	for (const file of commandFiles) {
		const props = require(`./commands-${language}/${file}`);
		bot.commands.set(props.name, props);
	}

	// Obter o prefixo definido para o servidor
	const refP = db.collection('servidores').doc(message.guild.id);

	if (!prefixes[message.guild.id]) {
		const doc = await refP.get();
		prefixes[message.guild.id] = doc.get('prefix') || config.prefix;
	}

	const prefix = prefixes[message.guild.id];

	if (prefix) {
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
							reward = rewards[`Level ${level + 1}`];

						if (rewardsArray.includes(stringLevel)) {
							db.collection('perfis').doc(message.author.id).update({
								balance: bal + reward,
							});
							switch (language) {
							case 'en':
								message.channel.send(`🎉 Congratulations ${message.author}, you leveled up to ${newLevel} and received ¤${reward}! 🆙💰`);
								break;
							default:
								message.channel.send(`🎉 Parabéns ${message.author}, subiste para o nível ${newLevel} e recebeste ¤${reward}! 🆙💰`);
								break;
							}
						}
						else {
							switch (language) {
							case 'en':
								message.channel.send(`🎉 Congratulations ${message.author}, you leveled up to ${newLevel}! 🆙`);
								break;
							default:
								message.channel.send(`🎉 Parabéns ${message.author}, subiste para o nível ${newLevel}! 🆙`);
								break;
							}
						}
					}
				}
			}
		});

		if (!xpCooldown.has(message.author.id)) {

			xpCooldown.add(message.author.id);
			setTimeout(() => {
				xpCooldown.delete(message.author.id);
			}, 60000);
		}

		try {
			command.execute(bot, message, command, args, db, language, languages, prefix, prefixes);
		}
		catch (err) {
			console.error(err);
			switch (language) {
			case 'en':
				message.reply('there was an error when trying to execute that command!');
				break;
			default:
				message.reply('ocorreu um erro ao tentar executar esse comando!');
				break;
			}
		}
	}

	const mention = message.mentions.users.first();

	if (message.content === mention && mention === bot.user) {
		return message.channel.send(`O nosso prefixo para este servidor é **${prefix}**`);
	}

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
});

// Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
bot.on('guildCreate', async guildData => {
	db.collection('servidores').doc(guildData.id).set({
		'guildOwnerID': guildData.owner.user.id,
	});
	bot.user.setActivity(`+help em ${bot.guilds.cache.size} servidores!`);
});

// Quando o bot for expulso de um servidor, o bot apagará os dados respetivos
bot.on('guildDelete', async guildData => {
	db.collection('servidores').doc(guildData.id).delete();
	bot.user.setActivity(`+help em ${bot.guilds.cache.size} servidores!`);
});

// Quando os dados de um servidor forem atualizados, o bot substituirá dados anteriores
bot.on('guildUpdate', async (oldGuild, newGuild) => {
	if (oldGuild.ownerID != newGuild.ownerID) {
		db.collection('servidores').doc(newGuild.id).set({
			'guildOwnerID': newGuild.owner.user.id,
		});
	}
});

// Autenticação do bot
bot.login(config.token);
