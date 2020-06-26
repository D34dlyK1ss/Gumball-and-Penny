const Discord = require('discord.js'); //Biblioteca do Discord.js
const bot = new Discord.Client(); //Cliente

const config = require('./config.json'); //Propriedades default do bot
const token = config.token; //Token do bot para autenticação
const botOwner = config.botOwner; //Discord ID do proprietário do bot

const fs = require('fs'); //File System

bot.commands = new Discord.Collection(); //Classe de utilidade 'Collection' do Discord.js

const admin = require('firebase-admin'); //Acesso de administrador à BD
const serviceAccount = require('./serviceAccountKey.json'); //Chaves de autenticação à BD
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), //Autenticação à BD
  databaseURL: 'https://pap-dc-bot.firebaseio.com'
});

const db = admin.firestore();

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

//Uma vez que o bot está ativo:
bot.once('ready', async () => {
  console.log('Preparado!'); //Avisa que está apto para receber comandos
});

//Ações para quando o bot receber uma mensagem
bot.on('message', message => {
  //Ignorar mensagens de outros bots e mensagens privadas
  if (message.channel.type === 'dm') return;
  if (message.author.bot) return;

  let prefix;

  db.collection('servidores').doc(message.guild.id).get().then((query) => {
    if (query.exists){
      prefix = query.data().prefix; //Obter o prefixo definido para o servidor
    }
  }).then(() => {
    let array = message.content.split(' ');
    let command = array[0];
    let args = array.slice(1);
    
    if (!command.startsWith(prefix)) return; //Ignorar mensagens que não comecem com o prefixo

    if (bot.commands.get(command.slice(prefix.length))){
      let cmd = bot.commands.get(command.slice(prefix.length));
      if (cmd){
        cmd.run(bot, message, command, args, db); //Correr as ações do comando
      }
    }
  });

  let gName = db.collection('servidores').doc(message.guild.id).get('guildName');
  let oName = db.collection('servidores').doc(message.guild.id).get('ownerName');
  let mCount = db.collection('servidores').doc(message.guild.id).get('memberCount');

  //Atualizar o Nome do Servidor
  if (message.guild.name != gName) {
    db.collection('servidores').doc(message.guild.id).update({
      guildName: message.guild.name
    });
  }

  //Atualizar o nome do proprietário do servidor
  if (message.guild.owner.user.username != oName) {
    db.collection('servidores').doc(message.guild.id).update({
      guildOwner: message.guild.owner.user.username
    });
  }

  //Atualizar o número de membros do servidor
  if (message.guild.members != mCount) {
    db.collection('servidores').doc(message.guild.id).update({
      memberCount: message.guild.memberCount
    });
  }
});

//Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
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

//Autenticação do bot
bot.login(token);