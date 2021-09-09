// Biblioteca do Discord.js
import { Collection, Client, Intents, Guild, Message } from 'discord.js';

// Interface para as definções do servidor
export interface ServerSettings {
	automessages: boolean;
	language: string;
	prefix: string;
}

// Interface para a execução de comandos
export interface Cmd {
	name: string;
	aliases?: string[];
	execute(bot: Client, message: Message, command: Cmd, db: any, lang: Record<string, string>, language: string, prefix: string, args: string[], serverSettings: ServerSettings): void;
}

// Extenção do tipo Client da biblioteca discord.js
export class BotClient extends Client {
	commands: Collection<string, Cmd> = new Collection<string, Cmd>();
}

// Cliente do bot
const bot = new BotClient({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Tokens de autenticação
import { config } from 'dotenv';
config();

// Propriedades default do bot
import botConfig from './botConfig.json';

// Descrição do bot na plataforma
function setActivity() {
	let plural = '';
	if (bot.guilds.cache.size !== 1) plural = 'es';
	const botActivity1 = `${botConfig.settings.prefix}help em`;
	const botActivity2 = `servidor${plural}!`;
	bot.user.setActivity(`${botActivity1} ${bot.guilds.cache.size} ${botActivity2}`);
}

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
	credential: admin.credential.cert(serviceAccount as any),
	databaseURL: 'https://gumball-and-penny.firebaseio.com'
});

const db = admin.firestore();

// Funções úteis
import removeVIP from './src/functions/removeVIP';
import giveVIP from './src/functions/giveVIP';
import { shopButtonHandler } from './src/functions/shopHandler';
import { quizButtonHandler } from './src/functions/quizHandler';
import { confirmLanguage } from './src/functions/setlanguageHandler';

const vips: Set<string> = new Set();

// Uma vez que o bot está ativo, realizar as seguintes ações
bot.once('ready', () => {
	setActivity();

	removeVIP(admin, bot, db, vips);

	setInterval(() => {
		removeVIP(admin, bot, db, vips);
	}, 86400000);

	setInterval(() => {
		dbl.postStats(bot.guilds.cache.size);
	}, 1800000);

	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);
});

import EventSource from 'eventsource';
const eventSourceInit: Record<string, any> = { headers: { 'Authorization': 'Bearer 14aee8db11a152ed7f2d4ed23a839d58' } };
const es = new EventSource('https://api.pipedream.com/sources/dc_OLuY0W/sse', eventSourceInit);

es.onopen = () => {
	console.log('Atentos ao fluxo SSE em https://api.pipedream.com/sources/dc_OLuY0W/sse');
};

es.onmessage = async messageEvent => {
	const data = JSON.parse(messageEvent.data);
	const agent = data.event.headers['user-agent'];
	const authorization = data.event.headers.authorization;
	const userID = data.event.body.user;
	const type = data.event.body.type;

	if (agent === 'DBL' && authorization === 'Gumball&PennyDBL') {
		if (type === 'upvote') {
			const refP = db.collection('perfis').doc(userID);

			await refP.get().then(doc => {
				if (!doc.exists) return;
				const bal: number = doc.get('balance');
				let add = 150;

				if (userID === botConfig.botOwner || botConfig.collaborators.includes(userID) || vips.has(userID)) {
					add *= 2;
				}
				else {
					refP.get().then((docP: any) => {
						if (docP.exists) add *= 2;
					});
				}

				refP.update({
					balance: bal + add
				});
			});
		}
	}
};

const settings: any = new Object();
const xpCooldown: Set<string> = new Set();

async function getServerSettings(guild: Guild) {
	const ref = db.collection('definicoes').doc(guild.id);
	if (!settings[guild.id]) {
		const doc = await ref.get();
		settings[guild.id] = doc.get('settings') || botConfig.settings;
	}
	const serverSettings: ServerSettings = settings[guild.id];

	return serverSettings;
}

// Ações para quando o bot receber uma mensagem
bot.on('messageCreate', async message => {
	if (message.channel.id === '810529155955032115' && message.content === `${botConfig.settings.prefix}activate` && message.member.id === botConfig.botOwner) {
		giveVIP(db, message, undefined);
	}

	if (message.channel.id === '809182965607039007') {
		const array = message.content.split(' ');
		array[0].slice(botConfig.settings.prefix.length).toLowerCase();
		const args = array.slice(1);

		if (message.content.startsWith(`${botConfig.settings.prefix}setvip`)) {
			giveVIP(db, message, args);
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

	//  Obter as definições do bot para o servidor
	const serverSettings = await getServerSettings(message.guild);
	const prefix = serverSettings.prefix;
	const englishChannels = ['809182965607039007', '787661396652589077', '787674033331634196'];
	let language;

	if (englishChannels.includes(message.channel.id)) language = 'en';
	else language = serverSettings.language;

	const lang = require(`./lang/${language}.json`);

	if (message.content.toLowerCase().startsWith(prefix)) {
		const array = message.content.split(' ');
		const commandName = array[0].slice(prefix.length).toLowerCase();
		const args = array.slice(1);

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
					const xp: number = doc.get('xp');
					const level = Math.floor(Math.sqrt(xp / 2000000) * 99) + 1;
					let add = Math.floor(Math.random() * 10) + 50;
					let	newXP: number;

					if (vips.has(message.author.id) || message.author.id === botConfig.botOwner || botConfig.collaborators.includes(message.author.id)) add *= 2;

					newXP = xp + add;

					if (newXP > 2000000) newXP = 2000000;

					const newLevel = Math.floor(Math.sqrt(newXP / 2000000) * 99) + 1;

					db.collection('perfis').doc(message.author.id).update({
						xp: newXP
					}).then(() => {
						if (newLevel > level) {
							db.collection('perfis').doc(message.author.id).update({
								level: newLevel
							});

							const bal: number = doc.get('balance');

							if (newLevel % 10 === 0) {
								const reward = newLevel * 500;
								db.collection('perfis').doc(message.author.id).update({
									balance: bal + reward
								}).then(async () => message.channel.send(`🎉 ${lang.levelUp.congrats} **${message.author.tag}**, ${lang.levelUp.levelTo} **${newLevel}** ${lang.levelUp.received}${reward}! 🆙💰`));
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
	else if (message.content === `<@${bot.user.id}>`) {
		message.channel.send(`${lang.prefixMsg} \`${prefix}\``);
	}
	else if (serverSettings.automessages === true) {
		const pngs = ['boi', 'E', 'hmm', 'just monika', 'nice plan', 'no u', 'noice', 'shine'];
		const gifs = ['distraction dance'];

		if (pngs.includes(message.content)) {
			message.channel.send({ files: [`./img/automessages/${message.content}.png`] }).catch(err => { console.error(err); });
		}
		else if (gifs.includes(message.content)) {
			message.channel.send({ files: [`./img/automessages/${message.content}.gif`] }).catch(err => { console.error(err); });
		}
	}
});

let newLanguage: string|undefined;

bot.on('interactionCreate', async interaction => {
	//  Obter as definições do bot para o servidor
	const serverSettings = await getServerSettings(interaction.guild);
	const prefix = serverSettings.prefix;
	const englishChannels = ['809182965607039007', '787661396652589077', '787674033331634196'];
	let language;

	if (englishChannels.includes(interaction.channel.id)) language = 'en';
	else language = serverSettings.language;

	const lang = require(`./lang/${language}.json`);

	if (interaction.isButton()) {
		if (interaction.customId.startsWith('shop')) shopButtonHandler(interaction, lang, prefix);
		else if (interaction.customId.startsWith('quiz')) quizButtonHandler(interaction, lang, prefix);
		else if (interaction.customId.startsWith('language')) confirmLanguage(interaction, db, newLanguage, lang, prefix, serverSettings);
	}
	if	(interaction.isSelectMenu()) {
		if (interaction.customId.startsWith('languageMenu')) {
			newLanguage = interaction.values[0];
			interaction.deferUpdate().catch(err => { console.log(err); });
		}
	}
});

// Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
bot.on('guildCreate', async guildData => {
	setActivity();
	await db.collection('definicoes').doc(guildData.id).set({
		settings: botConfig.settings
	}).catch((err: Error) => { console.error(err); });
});

// Quando o bot for expulso de um servidor, o bot apagará os dados respetivos
bot.on('guildDelete', async guildData => {
	setActivity();
	await db.collection('definicoes').doc(guildData.id).delete().catch((err: Error) => { console.error(err); });
});

// Autenticação do bot
bot.login(process.env.TOKEN);
