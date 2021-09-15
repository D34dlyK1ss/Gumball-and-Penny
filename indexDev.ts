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
function setBotStatus() {
	let plural = '';
	bot.guilds.cache.size !== 1 ? plural = '' : plural = 's';
	bot.user.setActivity({ name: `${botConfig.settings.prefix}help on ${bot.guilds.cache.size} server${plural}!`, type: 'WATCHING' });
}

// Biblioteca para momentos
import moment from 'moment';
moment.locale('pt');

// Biblioteca para sistema de ficheiros
import * as fs from 'fs';

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
import giveVIP from './src/functions/giveVIP';
import { shopButtonHandler } from './src/functions/shopHandler';
import { quizButtonHandler } from './src/functions/quizHandler';
import { confirmLanguage } from './src/functions/setlanguageHandler';

// Uma vez que o bot está ativo, realizar as seguintes ações
bot.once('ready', () => {
	setBotStatus();
	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);
});

const settings: any = new Object();

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
	const prefix = 'dev!';
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
});

let newLanguage: string|undefined;

bot.on('interactionCreate', async interaction => {
	//  Obter as definições do bot para o servidor
	const serverSettings = await getServerSettings(interaction.guild);
	const prefix = 'dev!';
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
	setBotStatus();
	await db.collection('definicoes').doc(guildData.id).set({
		settings: botConfig.settings
	}).catch((err: Error) => { console.error(err); });
});

// Quando o bot for expulso de um servidor, o bot apagará os dados respetivos
bot.on('guildDelete', async guildData => {
	setBotStatus();
	await db.collection('definicoes').doc(guildData.id).delete().catch((err: Error) => { console.error(err); });
});

// Autenticação do bot
bot.login(process.env.TOKENDEV);
