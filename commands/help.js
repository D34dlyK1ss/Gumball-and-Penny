const Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
  if (args ==''){
    const embed = new Discord.MessageEmbed()
      .setColor('#8000ff')
      .setTitle('Ajuda')
      .setAuthor('Gumball & Penny', 'https://i.imgur.com/FuYC9KG.jpg')
      .setThumbnail('https://i.imgur.com/FuYC9KG.jpg')
      .setDescription('Nós somos o Gumball e a Penny e temos como objetivo tornar qualquer servidor em que estamos num lugar divertido!\nEm caso de dúvida nalgum comando usa `+help [comando]`\nAqui está a lista de comandos disponíveis:')
      .addFields(
        { name: 'Diversão', value: '`avatar`, `fact`, `random`, `say`, `which`', inline: true },
        { name: 'Moderação', value: '`ban`, `clear`, `kick`, `setprefix`', inline: true },
        { name: 'Diversos', value: '`invite`, `members`, `ping`', inline: true },
      )

    message.channel.send(embed);
  }
  else {
    if (args == 'help') {
      message.channel.send('Se não sabes, soubesses! :unamused:');
    }

    if (args == 'invite') {
      message.channel.send('Mostraremos o link para nos convidares para um dos teus servidores!');
    }

    if (args == 'which') {
      message.channel.send('Com este comando podes saber que personagem de anime és!\nAnimes disponíveis: `akame ga kill`, `jojo`, `death note`');
    }

    if (args == 'ping') {
      message.channel.send('Uhm... pong?');
    }

    if (args == 'random') {
      message.channel.send('Diremos um número aleatório entre 1 e o número indicado. O predefinido é 100');
    }

    if (args == 'say') {
      message.channel.send('Isso faz um de nós dizer o que quiseres! :slight_smile:');
    }

    if (args == 'whichjojo') {
      message.channel.send("Com o 'whichjojo' diremos qual JoJo de _JoJo's Bizarre Adventure_ és!");
    }
  }
}

module.exports.help = {
  name: 'help'
}
