const Discord = require('discord.js'); //Biblioteca do Discord.js
const bot = new Discord.Client(); //Cliente

const config = require('./config.json'); //Propriedades default do bot
const token = config.token; //Token do bot para autenticação
const botOwner = config.botOwner; //Discord ID do proprietário do bot

const schedule = require('node-schedule');

const fs = require('fs'); //File System

bot.commands = new Discord.Collection(); //Classe de utilidade 'Collection' do Discord.js

const admin = require('firebase-admin'); //Acesso de administrador à BD
const serviceAccount = require('./serviceAccountKey.json'); //Chaves de autenticação à BD
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), //Autenticação à BD
  databaseURL: 'https://gumball-and-penny.firebaseio.com'
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
  console.log('Preparados!');

  const currentdate = new Date();
  const relationship = new Date(2019, 12, 28);
  const mili = currentdate - relationship;
  const months = Math.round(mili / 2629746000);
  const years = Math.round(mili / 31536000000);

  bot.user.setActivity("+help");
  let j = schedule.scheduleJob("0 15 28 * *", function () {
    bot.users.get("503009296267608066").send(":tada: Parabéns Lilly! Completaste " + (months + 1) + " meses com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/NyaigHE.gif");
    bot.users.get("287953505992572929").send(":tada: Parabéns Ruru! Completaste " + (months + 1) + " meses com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/NyaigHE.gif");
  });
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
  let oName = db.collection('servidores').doc(message.guild.id).get('guildOwner');
  let oID = db.collection('servidores').doc(message.guild.id).get('guildOwnerID');
  let mCount = db.collection('servidores').doc(message.guild.id).get('memberCount');

  //Atualizar o Nome do servidor
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

  //Atualizar o ID do proprietário do servidor
  if (message.guild.owner.user.id != oID) {
    db.collection('servidores').doc(message.guild.id).update({
      guildOwnerID: message.guild.owner.user.id
    });
  }

  //Atualizar o número de membros do servidor
  if (message.guild.members != mCount) {
    db.collection('servidores').doc(message.guild.id).update({
      memberCount: message.guild.memberCount
    });
  }

  if (message.content == 'shine') {
    message.channel.send({ files: ["images/shine.png"] });
  }

  if (message.content == 'boi') {
    message.channel.send({ files: ["images/boi.png"] });
  }

  if (message.content == 'just monika') {
    message.channel.send({ files: ["images/monika.png"] });
  }

  if (message.content == 'no u') {
    message.channel.send({ files: ["images/reverse.png"] });
  }

  if (message.content == 'E') {
    message.channel.send({ files: ["images/E.png"] });
  }

  if (message.content == 'hmm') {
    message.channel.send({ files: ["images/hmm.jpg"] });
  }
});

//Quando o bot for adicionado a um novo servidor, são armazenados dados do mesmo
bot.on('guildCreate', async guildData => {
  db.collection('servidores').doc(guildData.id).set({
    'guildID': guildData.id,
    'guildName': guildData.name,
    'guildOwner': guildData.owner.user.username,
    'guildOwnerID': guildData.owner.user.id,
    'memberCount': guildData.memberCount,
    'prefix': '+'
  });
});

//Autenticação do bot
bot.login(token);