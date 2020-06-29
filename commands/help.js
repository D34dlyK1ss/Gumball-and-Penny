const Discord = require('discord.js');

module.exports.run = async (bot, message, command, args, db) => {

  const embed = new Discord.MessageEmbed()
    .setColor('#8000ff')
    .setTitle('Ajuda')
    .setURL('https://discord.js.org/')
    .setAuthor('DC Bot', 'https://i.imgur.com/60QrOiR.png')
    .setDescription('O DC Bot ajuda a moderar, divertir e informar!\nAqui está a lista de comandos disponíveis:')
    .setThumbnail('https://i.imgur.com/60QrOiR.png')
    .addFields(
      { name: 'Diversos', value: '`avatar`, `members`, `ping`, `random`, `say`', inline: true },
      { name: 'Moderação', value: '`ban`, `clear`, `kick`, `setprefix`', inline: true },
      { name: 'Covid-19', value: '`covid`', inline: true },
    )

    message.channel.send(embed);
}

module.exports.help = {
  name: 'help'
}
