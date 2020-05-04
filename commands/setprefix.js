module.exports.run = async (bot, message, args, db) => {
  if (args.length === 0){
        message.channel.send('Preciso de saber qual é o prefixo desejado!');
      }
  else {
    let newPrefix = args[0];
    db.collection('servidores').doc(message.guild.id).update({
      'prefix': newPrefix
    }).then(() => {
      message.channel.send(`O prefixo para este servidor agora é **${newPrefix}**`);
    });
  }
}

module.exports.help = {
  name: 'setprefix'
}