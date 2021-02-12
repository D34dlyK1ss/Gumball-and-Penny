// Biblioteca do Discord.js
const { Client, Collection, MessageAttachment } = require('discord.js');

// Cliente
const bot = new Client();

// Tokens
require('dotenv').config();

// Propriedades default do bot
const config = require('./config.json');

// Descrição do bot na plataforma
function setActivity() {
	let plural = '';
	if (bot.guilds.cache.size != 1) plural = 'es';
	const botActivity1 = `${config.settings.prefix}help em `,
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
const rewards = require('./src/data/rewards.json');

// API do Discord Bot List
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.DBLTOKEN, bot);

// Classe de utilidade 'Collection' do Discord.js
bot.commands = new Collection();

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

const years = Math.round(mili / 31536000000);
const months = Math.round(mili / 2629746000) - (12 * years);
let pluralY, pluralM;

years == 1 ? pluralY = 'ano' : 'anos';
months == 1 ? pluralM = 'mês' : 'meses';

const removeVIP = require('./src/functions/removeVIP.js');
const vips = new Set();

// Uma vez que o bot está ativo, realizar as seguintes ações
bot.once('ready', async () => {
	setActivity();

	const officialServer = bot.guilds.cache.get('738540548305977366');

	let vipRole = officialServer.roles.cache.find(role => role.name === 'VIP');

	if(!vipRole) {
		officialServer.roles.create({
			data: {
				name: 'VIP',
				color: '#ffff00',
			},
		}).catch(err => { console.error(err); });
		vipRole = officialServer.roles.cache.find(role => role.name === 'VIP');
	}

	removeVIP(admin, db, vips, officialServer, vipRole);

	setInterval(() => {
		removeVIP(admin, db, vips, officialServer, vipRole);
	}, 86400000);

	setInterval(() => {
		dbl.postStats(bot.guilds.cache.size);
	}, 1800000);

	schedule.scheduleJob('0 14 28 * *', function() {
		bot.users.resolve(config.lilly).send(`:tada: Parabéns Lilly! Completaste ${years} ${pluralY} e ${months} ${pluralM} com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
		bot.users.resolve(config.botOwner).send(`:tada: Parabéns Ruru! Completaste ${years} ${pluralY} e ${months} ${pluralM} com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
	});

	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);
});

const EventSource = require('eventsource');
const eventSourceInit = { headers: { 'Authorization': 'Bearer 14aee8db11a152ed7f2d4ed23a839d58' } };
const es = new EventSource('https://api.pipedream.com/sources/dc_OLuY0W/sse', eventSourceInit);

es.onopen = () => {
	console.log('Atentos ao fluxo SSE em https://api.pipedream.com/sources/dc_OLuY0W/sse');
};

es.onmessage = async messageEvent => {
	const data = JSON.parse(messageEvent.data);
	const agent = data.event.headers['user-agent'],
		authorization = data.event.headers.authorization,
		userID = data.event.body.user;
	let type = data.event.body.type;

	if (agent === 'DBL' && authorization === 'Gumball&PennyDBL') {
		if (type != 'upvote') return;

		const refP = db.collection('perfis').doc(userID);

		refP.get().then(doc => {
			if (!doc.exists) return;
			const bal = doc.get('balance');
			refP.update({
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
			type = dataKF.type;
			if (type === 'Commision') {
				await bot.users.fetch(config.botOwner).then(botOwner => {
					botOwner.send(`**Nova compra!**\n**Nome:** ${name}\n**Quantia:** ${amount + currency}\n**Mensagem:** ${message}\n**ID:** ${id}\n**URL:** ${dataKF.url}`);
				});
			}
			else if (type === 'Donation') {
				await bot.users.fetch(config.botOwner).then(botOwner => {
					botOwner.send(`**${name} doou ${amount + currency}**\n**Mensagem:** ${message}\n**URL:** ${dataKF.url}`);
				});
			}
		}
	}
};

const settings = new Object(),
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

	const ref = db.collection('definicoes').doc(message.guild.id);

	//  Obter as definições do bot para o servidor
	if (!settings[message.guild.id]) {
		const doc = await ref.get();
		settings[message.guild.id] = doc.get('settings') || config.settings;
	}
	const serverSettings = settings[message.guild.id];
	const prefix = serverSettings.prefix || config.settings.prefix,
		language = message.channel.id === '787661396652589077' || message.channel.id === '787674033331634196' ? 'en' : serverSettings.language;
	const lang = require(`./lang/${language}.json`);

	if (message.content.toLowerCase().startsWith(prefix)) {
		const array = message.content.split(' '),
			commandName = array[0].slice(prefix.length).toLowerCase(),
			args = array.slice(1);
		const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Ignorar mensagem se o bot não tiver tal comando
		if (!command) return;

		// Adicionar XP ao perfil do utilizador
		if (!xpCooldown.has(message.author.id)) {
			xpCooldown.add(message.author.id);
			setTimeout(() => {
				xpCooldown.delete(message.author.id);
			}, 60000);

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
									}).then(() => message.channel.send(`🎉 ${lang.levelUp.congrats} **${message.author.tag}**, ${lang.levelUp.levelTo} **${newLevel}** ${lang.levelUp.received + reward}! 🆙💰`));
								}
								else {
									message.channel.send(`🎉 ${lang.levelUp.congrats} **${message.author.tag}**, ${lang.levelUp.levelTo} **${newLevel}**! 🆙`);
								}
							}
						}
					});
				}
			});
		}

		try {
			command.execute(bot, message, command, db, lang, language, prefix, args, serverSettings);
		}
		catch (err) {
			console.error(err);
			message.reply(lang.error.cmd);
		}
	}
	else if (serverSettings.automessages === true) {
		const pngs = ['boi', 'E', 'hmm', 'just monika', 'nice plan', 'no u', 'noice', 'shine'],
			gifs = ['distraction dance'];

		if (pngs.includes(message.content)) {
			message.channel.send(new MessageAttachment(`./img/automessages/${message.content}.png`)).catch(err => { console.error(err); });
		}
		else if (gifs.includes(message.content)) {
			message.channel.send(new MessageAttachment(`./img/automessages/${message.content}.gif`)).catch(err => { console.error(err); });
		}
	}
	else if (message.content === `<@!${bot.user.id}>`) {
		message.channel.send(`${lang.prefixMsg} \`${prefix}\``);
	}
});

// Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
bot.on('guildCreate', async guildData => {
	setActivity();
	await db.collection('definicoes').doc(guildData.id).set({
		settings: config.settings,
	}).catch(err => { console.error(err); });
});

// Quando o bot for expulso de um servidor, o bot apagará os dados respetivos
bot.on('guildDelete', async guildData => {
	setActivity();
	await db.collection('definicoes').doc(guildData.id).delete().catch(err => { console.error(err); });
});

// Autenticação do bot
bot.login(process.env.TOKEN);
