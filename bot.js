const Discord = require('discord.js');
const {token} = require('./config.json');
const bot = new Discord.Client();
const firebase = require('firebase');
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBHGPw5jyEJO7ehDBIVXbzOpLQQ8715G0Q",
  authDomain: "dc-bot-3caa4.firebaseapp.com",
  databaseURL: "https://dc-bot-3caa4.firebaseio.com",
  projectId: "dc-bot-3caa4",
  storageBucket: "dc-bot-3caa4.appspot.com",
  messagingSenderId: "1002622548576",
  appId: "1:1002622548576:web:c2d25d944cd55108e96105"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const permfail = 'Não tens permissão para usar este comando! :anger:'

bot.once('ready', () => {
  console.log('Preparado!');
  bot.user.setActivity('dc!help');
})

bot.on('message', async message => {
  var serverid = message.guild.id;
  var mentionMessage;
  var mention = message.mentions.users.first();
  var last = 0;
  var number = 0;
  var prefix ='dc!'
  db.ref(`servidores/${message.guild.id}/`).then(doc => {
    if (!doc.exists){
      let data = {
        prefixo: prefix
      };
      let servidorRef = db.ref(`servidores/${message.guild.id}/`).set(data);
      prefix = db.ref(`servidores/${message.guild.id}/prefixo`).data();
    }
    else {
      prefix = db.ref(`servidores/${message.guild.id}/prefixo`).data();
    }
  })
  .catch(err => {
    console.log('Erro ao receber documento', err);
  });

  if (message.content.substring(0, 1) == prefix) {
    var custom = message.content.substring(1).split(' ');
    var command = custom[0];
    custom = custom.splice(1);
    custom = custom.join(' ');
  }

  if (command == 'prefix'){
    let data = {
      prefixo: custom
    };
    let servidorRef = db.collection('servidores').doc(serverid);
    let setWithOptions = servidorRef.set({
      prefixo: true
    }, {merge: true});
    message.send('O prefixo para este servidor é agora`' + prefix + '`')
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
          number = parseInt(custom);
          if (number > 100){
            number = 100;
          }
          message.channel.bulkDelete(number)
          if (number == 1){
            message.channel.send("`1`mensagem foi apagada!").then(msg => msg.delete(3000)).catch(console.error);
          }
          else {
            message.channel.send("`" + number + "`mensagens foram apagadas!").then(msg => msg.delete(3000)).catch(console.error);
          }
        }
      }
    }
})

bot.login(token);
