import { Collection, Client, GatewayIntentBits, Guild, Interaction, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import https from 'https';

export interface ServerSettings {
	language: string;
}

export interface Cmd {
	execute(bot: BotClient, interaction: Interaction, db: FirebaseFirestore.Firestore, lang: Record<string, string | any>, language: string, serverSettings: ServerSettings): void;
}

export class BotClient extends Client {
	commands: Collection<string, Cmd> = new Collection<string, Cmd>();
}

const bot = new BotClient({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, intents: [GatewayIntentBits.Guilds] });

import { config } from 'dotenv';
config();

import botConfig from './botConfig.json';

function setBotStatus() {
	bot.user.setActivity({ name: 'Reinvite us to access our Slash Commands!', type: 3 }); //`${bot.guilds.cache.size} server${bot.guilds.cache.size !== 1 ? 's' : ''}!`, type: 3
}

function sendStats() {
	const options = {
		hostname: 'discordbotlist.com',
		port: 443,
		path: `/api/v1/bots/${bot.user.id}/stats`,
		method: 'POST',
		headers: { authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6IjY3OTA0MTU0ODk1NTk0MjkxNCIsImlhdCI6MTY1OTk1NTcwNn0.8nz5bBOSGBvi43obJd5UczPH1OgzywtAK2ZE5ZNBtnA', 'Content-Type': 'application/x-www-form-urlencoded' }
	};

	const req = https.request(options, res => {
		console.log(`statusCode: ${res.statusCode}`);
	  
		res.on('data', d => {
			process.stdout.write(d);
		});
	});
	  
	req.on('error', error => {
		console.error(error);
	});

	req.write(`guilds=${bot.guilds.cache.size}`); //users=${bot.guilds.cache.reduce((a, g) => a+g.memberCount, 0)}
	req.end();
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
import removeVIP from './src/functions/removeVIP';
import { shopButtonHandler } from './src/functions/shopHandler';
import { quizButtonHandler } from './src/functions/quizHandler';
import { confirmLanguage } from './src/functions/setlanguageHandler';

const vips: Set<string> = new Set();

bot.once('ready', () => {
	setBotStatus();
	removeVIP(admin, bot, db, vips);

	moment.locale('pt');
	console.log(`Preparados! (${moment().format('LL')} ${moment().format('LTS')})`);
});

import EventSource from 'eventsource';
import giveVoteRewards from './src/functions/giveVoteRewards';
const eventSourceInit: Record<string, any> = { headers: { 'Authorization': 'Bearer 14aee8db11a152ed7f2d4ed23a839d58' } };
const es = new EventSource('https://api.pipedream.com/sources/dc_OLuY0W/sse', eventSourceInit);

es.onopen = () => {
	console.log(`Atentos ao fluxo SSE em ${es.url}`);
};

es.onmessage = messageEvent => {
	const data = JSON.parse(messageEvent.data);
	
	if (data.event.headers.authorization === 'Gumball&PennyDBL' && data.event.headers['x-dbl-signature']) {
		giveVoteRewards(db, vips, data.event.body.id);
	}
};

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
	
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT),
			{ body: commands }
		);
		
		console.log('Slash commands recarregados!');
	}
	catch (error) {
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
					}).then(async () => {
						if (newLevel > level) {
							await db.collection('perfis').doc(interaction.user.id).update({
								level: newLevel
							});

							const bal: number = doc.get('balance');

							if (newLevel % 10 === 0) {
								const reward = newLevel / 10 * 500;
								
								await db.collection('perfis').doc(interaction.user.id).update({
									balance: bal + reward
								}).then( async () => await interaction.channel.send(getText(lang.levelUp.congratsReward, [interaction.user.tag, newLevel, reward])));
							}
							else {
								await interaction.channel.send(getText(lang.levelUp.congrats, [interaction.user.tag, newLevel]));
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

bot.on('guildMemberUpdate', async (oldMember, newMember) => {
	if (newMember.guild.id === '738540548305977366') {
		if (!oldMember.roles.cache.has('928782015971610624') && newMember.roles.cache.has('928782015971610624')) {
			const timestamp = new Date(Date.now() + 2592000000);
	
			db.collection('vip').doc(newMember.id).set({
				until: timestamp
			});
	
			vips.add(newMember.id);
			
			removeVIP(admin, bot, db, vips);
		}
		
		if (oldMember.roles.cache.has('928782015971610624') && !newMember.roles.cache.has('928782015971610624')) {
			vips.delete(newMember.id);
			await db.collection('vip').doc(newMember.id).delete();
		}
	}
});

bot.on('guildCreate', async guildData => {
	setBotStatus();
	sendStats();

	await db.collection('definicoes').doc(guildData.id).set({
		settings: botConfig.settings
	});
});

bot.on('guildDelete', async guildData => {
	setBotStatus();
	sendStats();

	await db.collection('definicoes').doc(guildData.id).delete();
});

bot.login(process.env.TOKEN);
