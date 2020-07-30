const Discord = require('discord.js'); //Biblioteca do Discord.js
const bot = new Discord.Client(); //Cliente
const config = require('./config.json'); //Propriedades default do bot
const token = config.token; //Token do bot para autenticação
const botOwner = config.botOwner; //Discord ID do proprietário do bot
const schedule = require('node-schedule');//Biblioteca para horários
const fs = require('fs'); //Biblioteca para sistema de ficheiros

bot.commands = new Discord.Collection(); //Classe de utilidade 'Collection' do Discord.js

const admin = require('firebase-admin'); //Acesso de administrador à BD
const serviceAccount = require('./serviceAccountKey.json'); //Chaves de autenticação à BD
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), //Autenticação à BD
  databaseURL: 'https://gumball-and-penny.firebaseio.com'
});

const db = admin.firestore();

//Leitura dos ficheiros de comandos

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
if (commandFiles.length === 0) return;
for (const file of commandFiles) {
  const props = require(`./commands/${file}`);
  bot.commands.set(props.name, props);
}

//Uma vez que o bot está ativo:
bot.once('ready', async () => {
  console.log('Preparados!');

  bot.user.setActivity("+help");

  const currentdate = new Date(),
        relationship = new Date(2019, 11, 28),
        mili = currentdate - relationship;

  const months = Math.round(mili / 2629746000),
        years = Math.round(mili / 31536000000);

  let j = schedule.scheduleJob("0 14 28 * *", function () {
    bot.users.resolve("503009296267608066").send(`:tada: Parabéns Lilly! Completaste ${months} meses com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
    bot.users.resolve("287953505992572929").send(`:tada: Parabéns Ruru! Completaste ${months} meses com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/clrwrEk.gif`);
  });
});

//Ações para quando o bot receber uma mensagem
bot.on('message', message => {
  //Ignorar mensagens de outros bots e mensagens privadas
  if (message.channel.type === 'dm' || message.author.bot) return;

  let prefix;
  let ref = db.collection('servidores').doc(message.guild.id);

  ref.get().then(doc => {
    if (doc.exists){
      prefix = doc.data().prefix; //Obter o prefixo definido para o servidor
    }
  }).then(() => {
    if (!message.content.startsWith(prefix)) return; //Ignorar mensagens que não começam com o prefixo

    const args = message.content.slice(prefix.length).trim().split(/ +/),
          commandName = args.shift().toLowerCase();

    if (!bot.commands.has(commandName)) return;

    const command = bot.commands.get(commandName);

    try {
      command.execute(message, args, db);
    } catch (err) {
      console.error(err);
      message.reply('houve um erro ao tentar executar esse comando!');
    }
  });

  let gName = ref.get('guildName'),
      oName = ref.get('guildOwner'),
      oID = ref.get('guildOwnerID'),
      mCount = ref.get('memberCount');

  //Atualizar o nome do servidor
  if (message.guild.name != gName) {
    ref.update({
      guildName: message.guild.name
    });
  }

  //Atualizar o nome do proprietário do servidor
  if (message.guild.owner.user.username != oName) {
    ref.update({
      guildOwner: message.guild.owner.user.username
    });
  }

  //Atualizar o ID do proprietário do servidor
  if (message.guild.owner.user.id != oID) {
    ref.update({
      guildOwnerID: message.guild.owner.user.id
    });
  }

  //Atualizar o número de membros do servidor
  if (message.guild.members != mCount) {
    ref.update({
      memberCount: message.guild.memberCount
    });
  }

  //Responder de acordo com o conteúdo da mensagem lida
  switch (message.content){
    case 'shine':
      message.channel.send({ files: ["images/shine.png"] });
      break;
    case 'boi':
      message.channel.send({ files: ["images/boi.png"] });
      break;
    case 'just monika':
      message.channel.send({ files: ["images/just monika.png"] });
      break;
    case 'no u':
      message.channel.send({ files: ["images/no u.png"] });
      break;
    case 'E':
      message.channel.send({ files: ["images/E.png"] });
      break;
    case 'hmm':
      message.channel.send({ files: ["images/hmm.png"] });
      break;
    case 'noice':
      message.channel.send({ files: ["images/noice.png"] });
      break;
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