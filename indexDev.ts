import { Collection, Client, Intents, Guild, Message } from 'discord.js';

export interface ServerSettings {
	automessages: boolean;
	language: string;
	prefix: string;
}

export interface Cmd {
	name: string;
	aliases?: string[];
	execute(bot: Client, message: Message, command: Cmd, db: FirebaseFirestore.Firestore, lang: Record<string, string>, language: string, prefix: string, args: string[], serverSettings: ServerSettings): void;
}

export class BotClient extends Client {
	commands: Collection<string, Cmd> = new Collection<string, Cmd>();
}

const bot = new BotClient({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

import { config } from 'dotenv';
config();

import botConfig from './botConfig.json';

function setBotStatus() {
	const plural = bot.guilds.cache.size === 1 ? '' : 's';
	bot.user.setActivity({ name: `${botConfig.settings.prefix}help on ${bot.guilds.cache.size} server${plural}!`, type: 'WATCHING' });
}

import * as fs from 'fs';

import * as admin from 'firebase-admin';

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: 'gumball-and-penny',
		privateKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
		clientEmail: 'firebase-adminsdk-weska@gumball-and-penny.iam.gserviceaccount.com'
	}),
	databaseURL: 'https://gumball-and-penny.firebaseio.com'
});

const db = admin.firestore();

import moment from 'moment';
import getText from './src/functions/getText';
import { shopButtonHandler } from './src/functions/shopHandler';
import { quizButtonHandler } from './src/functions/quizHandler';
import { confirmLanguage } from './src/functions/setlanguageHandler';

const vips: Set<string> = new Set();

bot.once('ready', () => {
	moment.locale('pt');
	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);
});

const settings: any = new Object();
const xpCooldown: Set<string> = new Set();

async function getServerSettings(guild: Guild) {
	const refD = db.collection('definicoes').doc(guild.id);

	if (!settings[guild.id]) {
		await refD.get().then(docD => {
			if (!docD.exists) {
				db.collection('definicoes').doc(guild.id).set({
					settings: botConfig.settings
				});
			}

			settings[guild.id] = docD.get('settings') || botConfig.settings;
		});
	}

	const serverSettings: ServerSettings = settings[guild.id];

	return serverSettings;
}

const englishChannels = ['809182965607039007', '787661396652589077', '787674033331634196'];

bot.on('messageCreate', async message => {
	if (!message.guild || message.channel.id === '810529155955032115' || message.author.bot) return;

	const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));
	if (commandFiles.length === 0) return;
	for (const file of commandFiles) {
		const props = require(`./src/commands/${file}`);
		bot.commands.set(props.name, props);
	}

	const serverSettings = await getServerSettings(message.guild);
	const prefix = 'dev!';
	let language;

	if (englishChannels.includes(message.channel.id)) language = 'en';
	else language = serverSettings.language;

	const lang = require(`./src/lang/${language}.json`);

	if (message.content.toLowerCase().startsWith(prefix)) {
		const array = message.content.split(' ');
		const commandName = array[0].slice(prefix.length).toLowerCase();
		const args = array.slice(1);

		const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

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

					if (vips.has(message.author.id) || message.author.id === botConfig.botOwnerID || botConfig.collaboratorIDs.includes(message.author.id)) add *= 2;

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
								}).then(async () => message.channel.send(getText(lang.levelUp.congratsReward, [message.author.tag, newLevel, reward])));
							}
							else {
								message.channel.send(getText(lang.levelUp.congrats, [message.author.tag, newLevel]));
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
		message.channel.send(getText(lang.prefixMsg, [prefix]));
	}
	else if (serverSettings.automessages === true) {
		const pngs = ['boi', 'E', 'hmm', 'just monika', 'nice plan', 'no u', 'noice', 'shine'];
		const gifs = ['distraction dance'];

		if (pngs.includes(message.content)) {
			message.channel.send({ files: [`./src/img/automessages/${message.content}.png`] });
		}
		else if (gifs.includes(message.content)) {
			message.channel.send({ files: [`./src/img/automessages/${message.content}.gif`] });
		}
	}
});

let newLanguage: string;

bot.on('interactionCreate', async interaction => {
	const serverSettings = await getServerSettings(interaction.guild);
	const prefix = 'dev!';
	let language;

	if (englishChannels.includes(interaction.channel.id)) language = 'en';
	else language = serverSettings.language;

	const lang = require(`./src/lang/${language}.json`);

	if (interaction.isButton()) {
		if (interaction.customId.startsWith('shop')) shopButtonHandler(interaction, lang, prefix);
		else if (interaction.customId.startsWith('quiz')) quizButtonHandler(interaction, lang, prefix);
		else if (interaction.customId.startsWith('language')) confirmLanguage(interaction, db, newLanguage, lang, prefix, serverSettings);
	}
	if	(interaction.isSelectMenu()) {
		if (interaction.customId.startsWith('languageMenu')) {
			newLanguage = interaction.values[0];
			interaction.deferUpdate();
		}
	}
});

bot.on('guildCreate', async guildData => {
	setBotStatus();
	await db.collection('definicoes').doc(guildData.id).set({
		settings: botConfig.settings
	});
});

bot.on('guildDelete', async guildData => {
	setBotStatus();
	await db.collection('definicoes').doc(guildData.id).delete();
});

bot.login(process.env.TOKENDEV);
