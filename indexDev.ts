import { ActivityType, Collection, Client, GatewayIntentBits, Guild, Interaction, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

export interface ServerSettings {
	language: string;
}

export interface Cmd {
	execute(bot: BotClient, interaction: Interaction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string, serverSettings: ServerSettings): void;
}

export class BotClient extends Client {
	commands: Collection<string, Cmd> = new Collection<string, Cmd>();
}

const bot = new BotClient({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

import { config } from 'dotenv';
config();

import botConfig from './botConfig.json';

function setBotStatus() {
	const plural = bot.guilds.cache.size !== 1 ? 's' : '';
	bot.user.setActivity({ name: `${bot.guilds.cache.size} server${plural}!`, type: ActivityType.Listening });
}

import fs from 'fs';

import admin from 'firebase-admin';

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: 'gumball-and-penny',
		privateKey: process.env.GOOGLE_APPLICATION_CREDENTIALS,
		clientEmail: 'firebase-adminsdk-weska@gumball-and-penny.iam.gserviceaccount.com'
	}),
	databaseURL: 'https://gumball-and-penny.firebaseio.com'
});

const db = admin.firestore();


import getText from './src/functions/getText';
import moment from 'moment';
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

const englishChannels = ['928784346826047488', '928784416917061683'];

const commands = [];
const commandsPath = './src/commands/';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = commandsPath + file;
	const props = require(filePath);
	commands.push(props.data.toJSON());
	bot.commands.set(props.data.name, props);
}

const rest = new REST().setToken(process.env.TOKENDEV);
const clientId = process.env.CLIENTDEV;
const guildId = '738540548305977366';

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
		);
	} catch (error) {
		console.error(error);
	}
})();

import items from './src/data/itemlist.json';
import titleCase from './src/functions/titleCase';

bot.on('interactionCreate', async interaction => {
	if (!interaction.guild || interaction.channel.id === '810529155955032115' || interaction.user.bot) return;

	if (interaction.isChatInputCommand()) {
		const serverSettings = await getServerSettings(interaction.guild);
		let language;

		if (englishChannels.includes(interaction.channel.id)) language = 'en';
		else language = serverSettings.language;

		const lang = require(`./src/lang/${language}.json`);

		const command = bot.commands.get(interaction.commandName);

		if (!command) return;

		if (!xpCooldown.has(interaction.user.id)) {
			xpCooldown.add(interaction.user.id);
			setTimeout(() => {
				xpCooldown.delete(interaction.user.id);
			}, 60000);

			db.collection('perfis').doc(interaction.user.id).get().then(doc => {
				if (!doc.exists) {
					return;
				}
				else {
					const xp: number = doc.get('xp');
					const maxXP = 2000000;
					const level = Math.floor(Math.sqrt(xp / maxXP) * 99) + 1;
					let add = Math.floor(Math.random() * 10) + 20;
					let	newXP: number;

					if (vips.has(interaction.user.id) || interaction.user.id === botConfig.botOwnerID || botConfig.collaboratorIDs.includes(interaction.user.id)) add *= 2;

					newXP = xp + add;

					if (newXP > maxXP) newXP = maxXP;

					const newLevel = Math.floor(Math.sqrt(newXP / maxXP) * 99) + 1;

					db.collection('perfis').doc(interaction.user.id).update({
						xp: newXP
					}).then(() => {
						if (newLevel > level) {
							db.collection('perfis').doc(interaction.user.id).update({
								level: newLevel
							});

							const bal: number = doc.get('balance');

							if (newLevel % 10 === 0) {
								const reward = newLevel * 500;
								db.collection('perfis').doc(interaction.user.id).update({
									balance: bal + reward
								}).then( async () => interaction.channel.send(getText(lang.levelUp.congratsReward, [interaction.user.tag, newLevel, reward])));
							}
							else {
								interaction.channel.send(getText(lang.levelUp.congrats, [interaction.user.tag, newLevel]));
							}
						}
					});
				}
			});
		}

		try {
			command.execute(bot, interaction, db, lang, language, serverSettings);
		}
		catch (err) {
			console.error(err);
			interaction.reply({ content: lang.error.cmd, ephemeral: true });
		}
	}
	else
	{
		const serverSettings = await getServerSettings(interaction.guild);
		let language: string, newLanguage: string;

		if (englishChannels.includes(interaction.channel.id)) language = 'en';
		else language = serverSettings.language;

		const lang = require(`./src/lang/${language}.json`);

		if (interaction.isButton()) {
			if (interaction.customId.startsWith('shop')) shopButtonHandler(interaction, lang);
			else if (interaction.customId.startsWith('quiz')) quizButtonHandler(interaction, lang);
			else if (interaction.customId.startsWith('language')) confirmLanguage(interaction, db, newLanguage, lang, serverSettings);
		}
		else if	(interaction.isSelectMenu()) {
			if (interaction.customId.startsWith('languageMenu')) {
				newLanguage = interaction.values[0];
			}
		}
		else if (interaction.isAutocomplete()) {
			const focusedOption = interaction.options.getFocused(true);
			let choices;

			if (interaction.commandName === 'shop') {
				switch(focusedOption.name) {
					case 'hudname':
						choices = Object.entries(items.huds);
						choices.shift();
						choices.shift();
						break;
					case 'pethudname':
						choices = Object.entries(items.petHuds);
						choices.shift();
						choices.shift();
						break;
					case 'itemname':
						choices = Object.entries(items.items);
						break;
					case 'petname':
						choices = Object.entries(items.pets);
						break;
				}

				choices = Object.fromEntries(choices.map(([key, value]) => {
					return [key.toLowerCase(), value];
				}));
			}

			const filtered = Object.keys(choices).filter(choice =>
				focusedOption.value !== '' ? focusedOption.value.length > 1 ? choice.includes(focusedOption.value.toLowerCase()) : choice.startsWith(focusedOption.value.toLowerCase()) : false
			);

			await interaction.respond(
				filtered.map(choice => ({ name: titleCase(choice), value: titleCase(choice) }))
			);
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
