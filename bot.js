const Discord = require('discord.js');
const {token, owner} = require('./config.json');
let prefix;
const bot = new Discord.Client();

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pap-dc-bot.firebaseio.com"
});

let db = admin.firestore();

const permfail = 'Não tens permissão para usar este comando! :anger:';

bot.once('ready', async () => {
  bot.user.setActivity('dc!help');
  console.log('Preparado!');
});

bot.on('message', async message => {
  db.collection('servidores').doc(message.guild.id).get().then((query) => {
    if (query.exists){
      prefix = query.data().prefix;
    }
  }).then(() => {
    if (message.content.substring(0, 1) == prefix) {
      if (msg.channel.type === "dm") return;
      if (msg.author.bot) return;

      let custom = message.content.substring(1).split(' ');
      let command = custom[0];
      custom = custom.splice(1);
      custom = custom.join(' ');
    }

    if (command == 'setprefix'){
      if (custom == ''){
        message.channel.send('Preciso de saber qual é o prefixo desejado!');
      }
      else{
        let newPrefix = custom;
        db.collection('guilds').doc(message.guild.id).update({
          'prefix': newPrefix
        }).then(() => {
          message.channel.send(`O prefixo para este servidor agora é ${newPrefix}`);
        });
      }
    }

    if (command == 'ping') {
      message.reply('Pong!');
    }

    if (command == 'invite') {
      message.channel.send('Convida-me para o teu server! :grin:\nhttps://discordapp.com/oauth2/authorize?&client_id=706141316446421053&scope=bot&permissions=8');
    }

    if (command == 'say') {
      message.delete();
      if (custom.startsWith("http")){
        message.channel.send("Não posso escrever links!").then(msg => msg.delete(3000));
      }
      else{
        message.channel.send(custom);
      }
    }

    if (command == 'random') {
      if (custom == '')
      {
        rnd = Math.floor(Math.random() * 100) + 1;
      }
      else {
        rnd = Math.floor(Math.random() * custom) + 1;
      }
      message.channel.send(rnd + '!');
    }

    if (command == 'dm'){
      let mentionMessage;
      let mention = message.mentions.users.first();

      if (mention == null) {
        message.delete();
        message.reply("Não mencnionaste ninguém!").then(msg => msg.delete(3000));
      }
      else{
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
          message.delete();
          var mention2 =  String(mention);
          mentionMessage = message.content.slice (5 + 21);
          mention.sendMessage (mentionMessage);
        }
        else {
            message.delete();
            message.reply(permfail).then(msg => msg.delete(3000));
        }
      }
    }

    if (command == 'clear') {
      message.delete();
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
          message.reply(permfail).then(msg => msg.delete(3000));
      }
      else {
          if (custom == '' || custom == '0')
          {
            message.reply("Tens de definir o número de mensagens que queres apagar!").then(msg => msg.delete(3000));
          }
          else
          {
            let number = parseInt(custom);
            if (number > 100){
              number = 100;
            }
            message.channel.bulkDelete(number)
            if (number == 1){
              message.channel.send('`1`mensagem foi apagada!').then(msg => msg.delete(3000)).catch(console.error);
            }
            else {
              message.channel.send('`' + number + '`mensagens foram apagadas!').then(msg => msg.delete(3000)).catch(console.error);
            }
          }
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
