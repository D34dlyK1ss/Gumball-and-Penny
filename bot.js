const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

let prefix;
const token = config.token;
const owner = config.owner;

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pap-dc-bot.firebaseio.com"
});

let db = admin.firestore();

fs.readdir('./commands', (err, files) => {
  if (err){
    console.log(err);
  }

  let commandFiles = files.filter(f => f.split('.').pop() === 'js');

  if (command.length === 0) return;

  commandFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    bot.commands.set(props.help.name, props);
  });

})

bot.once('ready', async () => {
  bot.user.setActivity('dc!help');
  console.log('Preparado!');
});

bot.on('message', message => {

  db.collection('servidores').doc(message.guild.id).get().then((query) => {
    if (query.exists){
      prefix = query.data().prefix;
    }
  }).then(() => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;

    let array = message.content.split(' ');
    let command = array[0];
    let args = array.slice(1);

    if (!command.startsWith(prefix)) return;

    if (bot.commands.get(command.slice(prefix.length))){
      let cmd = bot.commands.get(command.slice(prefix.length));
      if (cmd){
        cmd.run(bot, message, args, db);
      }
    }
  });
});

bot.on('guildCreate', async guildData => {
  db.collection('servidores').doc(guildData.id).set({
    'guildID': guildData.id,
    'guildName': guildData.name,
    'guildOwner': guildData.owner.user.username,
    'guildOwnerID': guildData.owner.id,
    'guildMemberCount': guildData.memberCount,
    'prefix': 'dc!'
  });
});

bot.login(token);
