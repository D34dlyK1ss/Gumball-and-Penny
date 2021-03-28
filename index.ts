// Biblioteca do Discord.js
import { Collection, Client, Message, MessageAttachment } from 'discord.js';

export interface serverSettings {
	automessages: boolean,
	language: string,
	prefix: string
}

export interface Cmd {
	name: string;
	aliases?: string[];
	execute(bot: Client, message: Message, command: Cmd, db: any, lang: Record<string, string>, language: string, prefix: string, args: string[], serverSettings: serverSettings): void;
}

export class botClient extends Client  {
	commands: Collection<string, Cmd> = new Collection<string, Cmd>();
}

// Cliente
const bot = new botClient();

// Tokens
import { config } from 'dotenv';
config();

// Propriedades default do bot
import botConfig from './botConfig.json';

// Descrição do bot na plataforma
function setActivity() {
	let plural = '';
	if (bot.guilds.cache.size != 1) plural = 'es';
	const botActivity1 = `${botConfig.settings.prefix}help em `,
		botActivity2 = ` servidor${plural}!`;
	bot.user.setActivity(`${botActivity1 + bot.guilds.cache.size + botActivity2}`);
}

// Biblioteca para horários
import * as schedule from 'node-schedule';

// Biblioteca para momentos
import moment from 'moment';
moment.locale('pt');

// Biblioteca para sistema de ficheiros
import * as fs from 'fs';

// API do Discord Bot List
import DBL from 'dblapi.js';
const dbl = new DBL(process.env.DBLTOKEN, bot);

// Acesso de administrador à BD
import * as admin from 'firebase-admin';

// Chaves de autenticação à BD
import * as serviceAccount from './serviceAccountKey.json';
admin.initializeApp({
	// Autenticação à BD
	credential: admin.credential.cert((serviceAccount as any)),
	databaseURL: 'https://gumball-and-penny.firebaseio.com',
});

const db = admin.firestore();

const currentdate : Date = new Date(),
	relationship : Date = new Date(2019, 11, 28);
const mili = currentdate.getTime() - relationship.getTime();

const years = Math.round(mili / 31536000000);
const months = Math.round(mili / 2629746000) - (12 * years);
let pluralY: string, pluralM: string;

years === 1 ? pluralY = 'ano' : pluralY = 'anos';
months === 1 ? pluralM = 'mês' : pluralM = 'meses';

import removeVIP from './src/functions/removeVIP';
import giveVIP from './src/functions/giveVIP';

const vips: Set<string> = new Set();

// Uma vez que o bot está ativo, realizar as seguintes ações
bot.once('ready', async () => {
	setActivity();

	removeVIP(admin, bot, db, vips);

	setInterval(() => {
		removeVIP(admin, bot, db, vips);
	}, 86400000);

	setInterval(() => {
		dbl.postStats(bot.guilds.cache.size);
	}, 1800000);

	schedule.scheduleJob('0 14 28 * *', function() {
		bot.users.resolve(botConfig.lilly).send(`:tada: Parabéns Lilly! Completaste ${years} ${pluralY} e ${months} ${pluralM} com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
		bot.users.resolve(botConfig.botOwner).send(`:tada: Parabéns Ruru! Completaste ${years} ${pluralY} e ${months} ${pluralM} com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
	});

	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);
});

import EventSource from 'eventsource';
const eventSourceInit : object = { headers: { 'Authorization': 'Bearer 14aee8db11a152ed7f2d4ed23a839d58' } };
const es = new EventSource('https://api.pipedream.com/sources/dc_OLuY0W/sse', eventSourceInit);

es.onopen = () => {
	console.log('Atentos ao fluxo SSE em https://api.pipedream.com/sources/dc_OLuY0W/sse');
};

es.onmessage = async messageEvent => {
	const data = JSON.parse(messageEvent.data);
	const agent = data.event.headers['user-agent'],
		authorization = data.event.headers.authorization,
		userID = data.event.body.user,
		type = data.event.body.type;

	if (agent === 'DBL' && authorization === 'Gumball&PennyDBL') {
		if (type != 'upvote') return;

		const refP = db.collection('perfis').doc(userID);

		refP.get().then((doc: any) => {
			if (!doc.exists) return;
			const bal = doc.get('balance');
			let add = 150;

			if (userID === botConfig.botOwner || userID === botConfig.lilly || vips.has(userID)) {
				add *= 2;
			}
			else {
				refP.get().then((docP: any) => {
					if (docP.exists) add *= 2;
				});
			}

			refP.update({
				balance: bal + add,
			});
		});
	}
};

const settings: any = new Object(),
	xpCooldown: Set<string> = new Set();

// Ações para quando o bot receber uma mensagem
bot.on('message', async (message: Message) => {
	if (message.channel.id === '810529155955032115' && message.content === `${botConfig.settings.prefix}activate`) {
		return giveVIP(db, message, undefined);
	}

	if (message.channel.id === '809182965607039007') {
		const array = message.content.split(' ');
		array[0].slice(botConfig.settings.prefix.length).toLowerCase();
		const args = array.slice(1);
		
		if (message.content.startsWith(`${botConfig.settings.prefix}setvip`)) {
			return giveVIP(db, message, args);
		}
	}

	// Ignorar mensagens privadas e mensagens de outros bots
	if (!message.guild || message.channel.id === '810529155955032115' || message.author.bot) return;

	// Leitura dos ficheiros de comandos
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));
	if (commandFiles.length === 0) return;
	for (const file of commandFiles) {
		const props = require(`./commands/${file}`);
		bot.commands.set(props.name, props);
	}

	const ref = db.collection('definicoes').doc(message.guild.id);

	//  Obter as definições do bot para o servidor
	if (!settings[message.guild.id]) {
		const doc = await ref.get();
		settings[message.guild.id] = doc.get('settings') || botConfig.settings;
	}
	const serverSettings = settings[message.guild.id];
	const prefix = serverSettings.prefix || botConfig.settings.prefix,
		language = message.channel.id === '787661396652589077' || message.channel.id === '787674033331634196' ? 'en' : serverSettings.language;
	const lang = require(`./lang/${language}.json`);

	if (message.content.toLowerCase().startsWith(prefix)) {
		const array = message.content.split(' '),
			commandName = array[0].slice(prefix.length).toLowerCase(),
			args = array.slice(1);

		const command = bot.commands.get(commandName) || bot.commands.find(Cmd => Cmd.aliases && Cmd.aliases.includes(commandName));
		// Ignorar mensagem se o bot não tiver tal comando
		if (!command) return;

		// Adicionar XP ao perfil do utilizador
		if (!xpCooldown.has(message.author.id)) {
			xpCooldown.add(message.author.id);
			setTimeout(() => {
				xpCooldown.delete(message.author.id);
			}, 60000);

			db.collection('perfis').doc(message.author.id).get().then((doc: any) => {
				if (!doc.exists) {
					return;
				}
				else {
					const xp = doc.get('xp');
					const level = Math.floor(Math.sqrt(xp / 2000000) * 99) + 1;
					let add = Math.floor(Math.random() * 10) + 50,
						newXP: number;

					if (vips.has(message.author.id) || message.author.id === botConfig.botOwner || message.author.id === botConfig.lilly) add *= 2;

					newXP = xp + add;

					if (newXP > 2000000) newXP = 2000000;

					const newLevel = Math.floor(Math.sqrt(newXP / 2000000) * 99) + 1;

					db.collection('perfis').doc(message.author.id).update({
						xp: newXP,
					}).then(() => {
						if (newLevel > level) {
							db.collection('perfis').doc(message.author.id).update({
								level: newLevel,
							});

							const bal = doc.get('balance');
							if (newLevel % 10 === 0) {
								const reward = newLevel * 500;
								db.collection('perfis').doc(message.author.id).update({
									balance: bal + reward,
								}).then(() => message.channel.send(`🎉 ${lang.levelUp.congrats} **${message.author.tag}**, ${lang.levelUp.levelTo} **${newLevel}** ${lang.levelUp.received + reward}! 🆙💰`));
							}
							else {
								message.channel.send(`🎉 ${lang.levelUp.congrats} **${message.author.tag}**, ${lang.levelUp.levelTo} **${newLevel}**! 🆙`);
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
		settings: botConfig.settings,
	}).catch(err => { console.error(err); });
});

// Quando o bot for expulso de um servidor, o bot apagará os dados respetivos
bot.on('guildDelete', async guildData => {
	setActivity();
	await db.collection('definicoes').doc(guildData.id).delete().catch(err => { console.error(err); });
});

// Autenticação do bot
bot.login(process.env.TOKEN);
