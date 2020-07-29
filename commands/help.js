const Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {
  args = args.toString();
  command = bot.commands.get(args);
  let name = args.charAt(0).toUpperCase() + args.slice(1);
  const helpEmbed = new Discord.MessageEmbed()
    .setColor('#8000ff')
    .setTitle('Ajuda')
    .setAuthor('Gumball & Penny', `${bot.user.displayAvatarURL()}`)
    .setThumbnail(`${bot.user.displayAvatarURL()}`)
    .setDescription('Nós somos o Gumball e a Penny e temos como objetivo tornar qualquer servidor em que estamos num lugar divertido!\nEm caso de dúvida nalgum comando usa `+help [nome do comando]`')
    .addFields(
      { name: '🎰 Casino', value: '`coinflip`', inline: true },
      { name: '😁 Diversão', value: '`fact`, `random`, `say`, `which`', inline: true },
      { name: '💰 Economia', value: '`balance`, `daily`', inline: true },
      { name: '⚠️ Moderação', value: '`ban`, `clear`, `kick`', inline: true },
      { name: '🌐 Servidor', value: '`members`, `setprefix`, `userinfo`', inline: true },
      { name: '🛠️ Utilidade', value: '`avatar`, `invite`, `ping`, `profile`', inline: true }
    );

  if (args == null || args == ''){
    message.channel.send(helpEmbed);
  }
  else {
    const commandEmbed = new Discord.MessageEmbed()
      .setColor('#8000ff')
      .addFields(
        { name: 'Nome', value: `${name}`},
        { name: 'Categoria', value: `${command.help.category}`},
        { name: 'Como usar', value: `${command.help.usage}`},
        { name: 'Descrição', value: `${command.help.description}` }
      );

    message.channel.send(commandEmbed);
  }
}

module.exports.help = {
  name: 'help',
  category: "Ajuda",
  description: "Se não sabes, soubesses! :unamused:",
  usage: "`+help`"
}
