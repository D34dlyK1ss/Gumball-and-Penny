//Inicializar o bot
const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const token = config.token;
const owner = config.owner;
let prefix;

//Aceder à base de dados
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pap-dc-bot.firebaseio.com'
});
let db = admin.firestore();

//Leitura dos ficheiros de comandos
fs.readdir('./commands', (err, files) => {
  if (err){
    console.log(err);
  }
  let commandFiles = files.filter(f => f.split('.').pop() === 'js');
  if (commandFiles.length === 0) return;
  commandFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    bot.commands.set(props.help.name, props);
  });
})

//Ações para quando o bot esitver online
bot.once('ready', async () => {
  bot.user.setActivity('dc!help'); //Definir a atividade, que é demonstrada online
  console.log('Preparado!'); //Verificar se o bot está apto para receber mensagens
});

//Ações para quando o bot receber uma mensagem
bot.on('message', message => {
  if (message.channel.type === 'dm') return;
  if (message.author.bot) return;

  db.collection('servidores').doc(message.guild.id).get().then((query) => {
    if (query.exists){
      prefix = query.data().prefix;
    }
  }).then(() => {
    let array = message.content.split(' ');
    let command = array[0];
    let args = array.slice(1);
    
    if (!command.startsWith(prefix)) return;

    if (bot.commands.get(command.slice(prefix.length))){
      let cmd = bot.commands.get(command.slice(prefix.length));
      if (cmd){
        cmd.run(bot, message, command, args, db);
      }
    }
  });

  let gName = db.collection('servidores').doc(message.guild.id).get('guildName');
  let oName = db.collection('servidores').doc(message.guild.id).get('ownerName');
  let mCount = db.collection('servidores').doc(message.guild.id).get('memberCount');
  
  if (message.guild.name != gName) {
    db.collection('servidores').doc(message.guild.id).update({
      guildName: message.guild.name
    });
  }

  if (message.guild.owner.user.username != oName) {
    db.collection('servidores').doc(message.guild.id).update({
      guildOwner: message.guild.owner.user.username
    });
  }

  if (message.guild.members != mCount) {
    db.collection('servidores').doc(message.guild.id).update({
      memberCount: message.guild.memberCount
    });
  }
});

//Ações para quando o bot for adicionado a um novo servidor
bot.on('guildCreate', async guildData => {
  db.collection('servidores').doc(guildData.id).set({
    'guildID': guildData.id,
    'guildName': guildData.name,
    'guildOwner': guildData.owner.user.username,
    'guildOwnerID': guildData.owner.id,
    'memberCount': guildData.memberCount,
    'prefix': 'dc!'
  });
});

//Para fazer login é usado o respetivo token de aplicação para Discord
bot.login(token);
