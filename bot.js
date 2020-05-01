const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const schedule = require('node-schedule');
const bot = new Discord.Client();
const date = new Date(2012, 11, 21, 5, 30, 0);
const currentdate = new Date();
const relationship = new Date(2019, 12, 28);
const mili = currentdate - relationship;
const months = Math.round(mili/2629746000);
const years = Math.round(mili/31536000000);
bot.once('ready', () => {
  console.log('Preparados!\nO prefixo é ' + prefix);
  bot.user.setActivity("+help");
  var j = schedule.scheduleJob("0 15 28 * *", function(){
    bot.users.get("503009296267608066").send(":tada: Parabéns Lilly! Completaste " + (months + 1) + " meses com o teu Ruru! :purple_heart:\nhttps://i.imgur.com/NyaigHE.gif");
    bot.users.get("287953505992572929").send(":tada: Parabéns Ruru! Completaste " + (months + 1) + " meses com a tua Lilly! :purple_heart:\nhttps://i.imgur.com/NyaigHE.gif");
  });
})

bot.on('message', message => {

  if (message.content.substring(0, 1) == prefix) {
    var mention = message.mentions.users.first();
    var custom = message.content.substring(1).split(' ');
    var command = custom[0];
    custom = custom.splice(1);
    custom = custom.join(' ');
  }

  var mentionMessage;
  var jojo = '';
  var last = 0;
  var number = 0;
  
  if (command == 'ping') {
    message.reply('Pong!');
  }

  if (command == 'help') {
    if (custom == '') {
      message.channel.send('Todos os nossos comandos! :video_game:\n```\nclear\nfact\nhelp\ninvite\nping\nrandom\nsay\nwhichjojo```Para saberes mais sobre algum comando usa `' + prefix + 'help [nome do comando]`.\n\nP.S.:Existem uns quantos secretos :smiling_imp:');
    }
    else {
      if (custom == 'help')
      {
        message.channel.send('Se não sabes, soubesses! :unamused:');
      }

      if (custom == 'invite')
      {
        message.channel.send('Mostraremos o link para nos convidares para um dos teus servidores!');
      }

      if (custom == 'ping')
      {
        message.channel.send('Uhm... pong?');
      }

      if (custom == 'random')
      {
        message.channel.send('Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100');
      }

      if (custom == 'say')
      {
        message.channel.send('Isso faz um de nós dizer o que quiseres! :slight_smile:');
      }

      if (custom == 'whichjojo')
      {
        message.channel.send("Com o 'whichjojo' diremos qual JoJo de _JoJo's Bizarre Adventure_ és!");
      }
    }
  }

  if (command == 'fact') {
    var rnd = Math.floor(Math.random() * 7);
    if (message.member.id == 271737298951995393)
    {
      rnd = 0;
    }

    if (rnd == 0)
    {
      message.channel.send('O Leandro é gay.\nhttps://i.imgur.com/CYTHGhZ.png');
    }

    if (rnd == 1)
    {
      message.channel.send('A soma de dois números idênticos é igual ao dobro de um deles. :nine: x :nine: = :nine: x :two:');
    }

    if (rnd == 2)
    {
      message.channel.send('Adolf Hitler foi um político alemão que serviu como líder do Partido Nazista, Chanceler do Reich e Führer da Alemanha Nazista desde 1934 até 1945. Como ditador do Reich Alemão, ele foi o principal instigador da Segunda Guerra Mundial e figura central do Holocausto.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hitler_portrait_crop.jpg/260px-Hitler_portrait_crop.jpg');
    }

    if (rnd == 3)
    {
      message.channel.send('Felix Arvid Ulf Kjellberg, mais conhecido por PewDiePie, é um youtuber sueco com o maior número subscritores no mundo.\nhttps://upload.wikimedia.org/wikipedia/commons/thumb/8/86/PewDiePie_at_PAX_2015_crop.jpg/220px-PewDiePie_at_PAX_2015_crop.jpg');
    }

    if (rnd == 4)
    {
      message.channel.send('A soma do valor dos lados opostos de um dado tradicional dá sempre a soma de 7. :game_die:');
    }

    if (rnd == 5)
    {
      message.channel.send('A cada 60 segundos em África, um minuto passa.\nhttps://s2.dmcdn.net/v/N3yL71REyTtHN8eYF/x1080');
    }

    if (rnd == 6)
    {
      message.channel.send('Ninguém morre por comer uma laranja à noite. :tangerine:');
    }
  }

  if (command == 'whichjojo') {
    last = message.member.id.slice(-1);
    if (last == 0)
    {
      jojo = 'És o George Joestar I! - "わたしの名はジョースター。"';
    }
    if (last == 1)
    {
      jojo = 'És a Jolyne Kujo! - "やれやれだわ。"';
    }
    if (last == 2)
    {
      jojo = 'És o Johnathan Joestar! - "サンライトイエローオーバードライブ！"';
    }
    if (last == 3)
    {
      jojo = 'És o Johnny Joestar! - "家に帰りましょう。。。"';
    }
    if (last == 4)
    {
      jojo = 'És o Josuke Higashikata! - "ぼくは一体何？！"';
    }
    if (last == 5)
    {
      jojo = 'És o George Joestar II! - ~~死んだ~~';
    }
    if (last == 6)
    {
      jojo = 'És o Josuke Higashikata! - "グレートですよこいつはァ！"';
    }
    if (last == 7)
    {
      jojo = 'És o Joseph Joestar! - "逃げるんだよ!"';
    }
    if (last == 8)
    {
      jojo = 'És o Jotaro Kujo! - "やれやれだぜ。"';
    }
    if (last == 9)
    {
      jojo = 'És o Giorno Giovanna! - "このジョルノジョバーナには夢がある。"';
    }
    message.channel.send(jojo, {files:["images/jojo (" + last + ").webp"]});
  }

  if (command == 'invite') {
    message.channel.send('Convida-nos para o teu server! :grin:\nhttps://discordapp.com/oauth2/authorize?&client_id=679041548955942914&scope=bot&permissions=1916267615');
  }

  if (command == 'say') {
      message.delete();
    if (custom.startsWith("http"){
        message.channel.send("Não podemos escrever links!");
        message.delete(3000);
    }
    else{
      message.channel.send(custom);
    }
  }

  if (message.content == 'shine') {
    message.channel.send({files:["images/shine.png"]});
  }

  if (message.content == 'boi') {
    message.channel.send({files:["images/boi.png"]});
  }

  if (message.content == 'just monika') {
    message.channel.send({files:["images/monika.png"]});
  }

  if (message.content == 'no u') {
    message.channel.send({files:["images/reverse.png"]});
  }

  if (message.content == 'E') {
    message.channel.send({files:["images/E.png"]});
  }

  if (message.content == 'hmm') {
    message.channel.send({ files: ["images/hmm.jpg"] });
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
      if (message.member.userID == 287953505992572929 || message.member.userID == 503009296267608066) {
        message.delete();
        var mention2 =  String(mention);
        mentionMessage = message.content.slice (5 + 21);
        mention.sendMessage (mentionMessage);
      }
      else {
          message.delete();
          message.reply("Não tens permissão para usar este comando! :anger:").then(msg => msg.delete(3000));
      }
    }
  }

  if (command == 'clear') {
    message.delete();
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        message.reply("Não tens permissão para usar este comando! :anger:").then(msg => msg.delete(3000));
    }
    else {
        if (custom == '' || custom == '0')
        {
          message.reply("tens de definir o número de mensagens que queres apagar!").then(msg => msg.delete(3000));
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
