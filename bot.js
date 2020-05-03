const Discord = require('discord.js');
const token = require('./config.json');
const bot = new Discord.Client();

const firebaseConfig = {
  apiKey: "AIzaSyBHGPw5jyEJO7ehDBIVXbzOpLQQ8715G0Q",
  authDomain: "dc-bot-3caa4.firebaseapp.com",
  databaseURL: "https://dc-bot-3caa4.firebaseio.com",
  projectId: "dc-bot-3caa4",
  storageBucket: "dc-bot-3caa4.appspot.com",
  messagingSenderId: "1002622548576",
  appId: "1:1002622548576:web:c2d25d944cd55108e96105"
};

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

const permfail = 'Não tens permissão para usar este comando! :anger:'

bot.once('ready', () => {
  bot.user.setActivity(prefix + 'help');
})

bot.on('message', message => {
  var serverid = message.guild.id;
  var mentionMessage;
  var mention = message.mentions.users.first();
  var last = 0;
  var number = 0;
  let servidorRef = db.collection('servidores').doc(serverid);
  let getDoc = servidorRef.get()
  .then(doc => {
    if (!doc.exists){
      let data = {
        prefix: '!'
      };
      let servidorRef = db.collection('servidores').doc(serverid).set(data);
    }
    else {
      var prefix = db.collection('servidores').doc(serverid).data(prefixo);
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
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

  if (command == 'help') {
    if (custom == '') {
      message.channel.send('Todos os comandos! :video_game:\n```\nclear\nfact\nhelp\ninvite\nping\nrandom\nsay\nwhichjojo```Para saberes mais sobre algum comando usa `' + prefix + 'help [nome do comando]`.\n\nP.S.:Existem uns quantos secretos :smiling_imp:');
    }
    else {

      if (custom == 'invite')
      {
        message.channel.send('O link para me convidar para um servidor!');
      }

      if (custom == 'ping')
      {
        message.channel.send('Uhm... pong?');
      }

      if (custom == 'random')
      {
        message.channel.send('Direi um número aleatório entre 1 e o número indicado. O predefinido é 100');
      }

      if (custom == 'say')
      {
        message.channel.send('Isso faz-me dizer o que quiseres! :slight_smile:');
      }
    }
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
