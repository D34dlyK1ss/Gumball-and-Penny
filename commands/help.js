const Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
  args = args.toString();
  const embed = new Discord.MessageEmbed()
    .setColor('#8000ff')
    .setTitle('Ajuda')
    .setAuthor('Gumball & Penny', `${bot.user.displayAvatarURL()}`)
    .setThumbnail(`${bot.user.displayAvatarURL()}`)
    .setDescription('Nós somos o Gumball e a Penny e temos como objetivo tornar qualquer servidor em que estamos num lugar divertido!\nEm caso de dúvida nalgum comando usa `+help [nome do comando]`\nAqui está a lista de comandos disponíveis:')
    .addFields(
      { name: 'Diversão', value: '`avatar`, `fact`, `random`, `say`, `which`' },
      { name: 'Moderação', value: '`ban`, `clear`, `kick`, `setprefix`' },
      { name: 'Diversos', value: '`invite`, `members`, `ping`, `userinfo`' }
    );

  if (args == null || args == ''){
    message.channel.send(embed);
  }
  else {
    switch (args) {
      case 'help':
        message.channel.send('Se não sabes, soubesses! :unamused:');
        break;
      case 'userinfo':
        message.channel.send('Com este comando serás informado sobre algum membro mencionado!');
        break;
      case 'invite':
        message.channel.send('Mostraremos o link para nos convidares para um dos teus servidores!');
        break;
      case 'which':
        message.channel.send('Com este comando podes saber que personagem de anime és!\nAnimes disponíveis: `akame ga kill`, `code geass`, `death note`, `jojo`, `kakegurui`, `mirai nikki`, `noragami`, `one punch man`');
        break;
      case 'ping':
        message.channel.send('Uhm... pong?');
        break;
      case 'random':
        message.channel.send('Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100');
        break;
      case 'say':
        message.channel.send('Isso faz um de nós dizer o que quiseres! :slight_smile:');
        break;
      case 'fact':
        message.channel.send("**Factos**");
        break;
    }
  }
}

module.exports.help = {
  name: 'help'
}
