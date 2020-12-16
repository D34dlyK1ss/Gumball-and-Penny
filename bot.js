// Biblioteca do Discord.js
const Discord = require('discord.js');

// Cliente
const bot = new Discord.Client();

// Propriedades default do bot
const config = require('./config.json');

// Descrição do bot na plataforma
function setActivity() {
	let plural = '';
	if (bot.guilds.cache.size != 1) plural = 'es';
	const botActivity1 = `${config.prefix}help em `,
		botActivity2 = ` servidor${plural}!`;
	bot.user.setActivity(`${botActivity1 + bot.guilds.cache.size + botActivity2}`);
}

// Biblioteca para horários
const schedule = require('node-schedule');

// Biblioteca para momentos
const moment = require('moment');
moment.locale('pt');

// Biblioteca para sistema de ficheiros
const fs = require('fs');

// Recompensas de nível
const rewards = require('./rewards.json');

// API do Discord Bot List
const DBL = require('dblapi.js');
const dbl = new DBL(config.dblToken, bot);

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

	setActivity();

	setInterval(() => {
		dbl.postStats(bot.guilds.cache.size);
	}, 1800000);

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

es.onmessage = async messageEvent => {
	const data = JSON.parse(messageEvent.data);
	const type = data.event.body.type,
		agent = data.event.headers['user-agent'],
		authorization = data.event.headers.authorization,
		userID = data.event.body.user;

	if (agent === 'DBL' && authorization === 'Gumball&PennyDBL') {
		if (type != 'upvote') return;

		const ref = db.collection('perfis').doc(userID);

		ref.get().then(doc => {
			if (!doc.exists) return;
			const bal = doc.get('balance');
			ref.update({
				balance: bal + 150,
			});
		});
	}
	else {
		const dataKF = JSON.parse(data.event.body.data) || null;

		if (dataKF.url.startsWith('https://ko-fi.com')) {
			const name = dataKF.from_name,
				amount = dataKF.amount,
				currency = dataKF.currency,
				id = dataKF.kofi_transaction_id,
				message = dataKF.message;
			if (type === 'Commision') {
				await bot.users.fetch(config.botOwner).then(botOwner => {
					botOwner.send(`**Nova compra!**\n**Nome:** ${name}\n**Quantia:** ${amount + currency}\n**Mensagem:** ${message}\n**ID:** ${id}\n**URL:** ${dataKF.url}`);
				});
			}
			else {
				await bot.users.fetch(config.botOwner).then(botOwner => {
					botOwner.send(`**${name} doou ${amount + currency}**\n**Mensagem:** ${message}\n**URL:** ${dataKF.url}`);
				});
			}
		}
	}
};

const prefixes = new Object(),
	languages = new Object(),
	xpCooldown = new Set();

// Ações para quando o bot receber uma mensagem
bot.on('message', async message => {

	// Ignorar mensagens privadas e mensagens de outros bots
	if (message.channel.type === 'dm' || message.author.bot) return;

	// Leitura dos ficheiros de comandos
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	if (commandFiles.length === 0) return;
	for (const file of commandFiles) {
		const props = require(`./commands/${file}`);
		bot.commands.set(props.name, props);
	}

	const ref = db.collection('servidores').doc(message.guild.id);

	// Obter o prefixo definido para o servidor
	if (!prefixes[message.guild.id]) {
		const doc = await ref.get();
		prefixes[message.guild.id] = doc.get('prefix') || config.prefix;
	}
	const prefix = prefixes[message.guild.id];

	// Seleção da linguagem
	if (!languages[message.guild.id]) {
		const doc = await ref.get();
		languages[message.guild.id] = doc.get('language') || config.language;
	}
	const language = message.channel.id === '787661396652589077' ? 'en' : languages[message.guild.id];
	const lang = require(`./languages/${language}.json`);

	// Servidor de Suporte
	const supportServer = bot.guilds.cache.get('738540548305977366');

	if (message.content.toLowerCase().startsWith(prefix)) {
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
				const level = doc.get('level'),
					xp = doc.get('xp'),
					refV = db.collection('vip').doc(message.author.id);
				let add = Math.floor(Math.random() * 11) + 50,
					newXP;

				refV.get().then(docV => {
					if (docV.exists) add *= 2;
				});

				newXP = xp + add;

				if (newXP > 2000000) newXP = 2000000;

				const newLevel = Math.floor(Math.sqrt(newXP / 2000000) * 100);

				db.collection('perfis').doc(message.author.id).update({
					xp: newXP,
				}).then(() => {
					if (newLevel != level) {
						db.collection('perfis').doc(message.author.id).update({
							level: newLevel,
						});

						if (newLevel > level) {
							const bal = doc.get('balance'),
								reward = rewards[`${level + 1}`];
							if (rewards.levels.includes(newLevel)) {
								db.collection('perfis').doc(message.author.id).update({
									balance: bal + reward,
								}).then(() => message.channel.send(`🎉 ${lang.levelUp.congrats + message.author + lang.lvlUp.levelTo + newLevel + lang.levelUp.received + reward}! 🆙💰`));
							}
							else {
								message.channel.send(`🎉 ${lang.levelUp.congrats + message.author + lang.lvlUp.levelTo + newLevel}! 🆙`);
							}
						}
					}
				});
			}
		});

		if (!xpCooldown.has(message.author.id)) {

			xpCooldown.add(message.author.id);
			setTimeout(() => {
				xpCooldown.delete(message.author.id);
			}, 60000);
		}
		try {
			command.execute(bot, message, command, db, lang, language, supportServer, prefix, args, prefixes, languages);
		}
		catch (err) {
			console.error(err);
			message.reply(lang.error.cmd);
		}
	}
	else if (message.content === `<@!${bot.user.id}>`) {
		message.channel.send(`${lang.prefixMsg} \`${prefix}\``);
	}
});

// Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
bot.on('guildCreate', async guildData => {
	setActivity();
	db.collection('servidores').doc(guildData.id).set({
		'guildOwnerID': guildData.owner.user.id,
	});
});

// Quando o bot for expulso de um servidor, o bot apagará os dados respetivos
bot.on('guildDelete', async guildData => {
	setActivity();
	db.collection('servidores').doc(guildData.id).delete();
});

// Quando os dados de um servidor forem atualizados, o bot substituirá dados anteriores
bot.on('guildUpdate', async (oldGuildData, newGuildData) => {
	if (oldGuildData.ownerID != newGuildData.ownerID) {
		db.collection('servidores').doc(newGuildData.id).set({
			'guildOwnerID': newGuildData.owner.user.id,
		});
	}
});

// Autenticação do bot
bot.login(config.token);
