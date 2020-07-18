const Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
  args = args.toString();
  commandname = bot.commands.get(args);
  const embed = new Discord.MessageEmbed()
    .setColor('#8000ff')
    .setTitle('Ajuda')
    .setAuthor('Gumball & Penny', `${bot.user.displayAvatarURL()}`)
    .setThumbnail(`${bot.user.displayAvatarURL()}`)
    .setDescription('Nós somos o Gumball e a Penny e temos como objetivo tornar qualquer servidor em que estamos num lugar divertido!\nEm caso de dúvida nalgum comando usa `+help [nome do comando]`\nAqui está a lista de comandos disponíveis:')
    .addFields(
      { name: 'Diversão', value: '`fact`, `random`, `say`, `which`' },
      { name: 'Diversos', value: '`avatar`, `invite`, `ping`' },
      { name: 'Moderação', value: '`ban`, `clear`, `kick`' },
      { name: 'Servidor', value: '`members`, setprefix`, `userinfo`' }
    );

  if (args == null || args == ''){
    message.channel.send(embed);
  }
  else{
    message.channel.send(`Categoria: ${commandname.help.category}\nDescrição: ${commandname.help.description}\nComo usar: ${commandname.help.usage}`).catch(err => { console.error(err) });
  }
}

module.exports.help = {
  name: 'help',
  category: "Ajuda",
  description: "Se não sabes, soubesses! :unamused:",
  usage: "`+help`"
}
